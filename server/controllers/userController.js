import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Users from "../models/Users.js";
import memoryCache from "memory-cache";
import FriendRequests from "../models/FriendRequests.js";
import { Sequelize } from "sequelize";


const signupLimit = 1;
const signupWindow = 60 * 60 * 1000;

const enumsFriends = {
    accepted:"accepted",
    pending:"pending",
    rejected:"rejected"
};

function hasExceededLimit(ip) {
    const count = memoryCache.get(ip) || 0;
    return count >= signupLimit;
}

const createSession = async (email, user, res) => {
    try {
        const token = jwt.sign({ email: email, name: user.username }, process.env.JWT_SECRET, {
            expiresIn: "1h",
            algorithm: 'HS256'
        });

        res.cookie("auth", token, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 1000 * 60 * 60
        });

        res.send({ message: "User logged in" });
    } catch (error) {
        console.error('Error creating session:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const register = async (req, res) => {
    const ip = req.ip;
    if (hasExceededLimit(ip)) {
        return res.status(429).send('Too many signups from this IP address.');
    }
    memoryCache.put(ip, (memoryCache.get(ip) || 0) + 1, signupWindow);
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertUser = await Users.create({
            username,
            email,
            password: hashedPassword,
            is_online: true,
        });


        if (!insertUser) throw new Error('Something went wrong');

        createSession(email, username, res);

    } catch (error) {
        res.status(500).json({
            error: "This account already exists"
        })
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    const userAuth = req.cookies.auth;
    if (userAuth) return res.status(200).send('Already logged In')
    try {
        const credentialsError = new Error("Email or password is incorrect")
        const user = await Users.findOne({ where: { email } });
        if (!user) throw credentialsError;

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw credentialsError;

        createSession(email, user, res);

    } catch (error) {
        res.status(400).json({
            error: error.message
        })
    }
}

const logout = async (req, res) => {
    try {
        const userAuth = req.cookies.auth;
        if (userAuth) {
            res.clearCookie("auth");
            res.status(200).json({ message: "Logout successfully" });
        } else {
            throw new Error('No session found')
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
}

const getUserAuthentication = async (req, res) => {
    try {
        const userAuth = req.user;
        if (userAuth) {
            res.status(201).json({
                status: res.statusCode,
                res: {
                    name: userAuth.email,
                    email: userAuth.name,
                    exp: userAuth.exp,
                }
            })
        }
    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const sendFriendRequest = async (req, res) => {
    const { from_user, to_user } = req.body;

    try {
        const existingRequest = await FriendRequests.findOne({
            where: {
                [Sequelize.Op.or]: [
                    { from_user: from_user, to_user: to_user },
                    { from_user: to_user, to_user: from_user },
                ],
            },
        });

        if (existingRequest) return res.status(400).json({ error: "Duplicate request" })

        const sendRequest = await FriendRequests.create({
            from_user: from_user,
            to_user: to_user,
        })

        if (!sendRequest) throw new Error('Something went wrong');

        return res.status(201).send('Created')

    } catch (error) {
        return res.status(500).json({
            error: error.message
        })
    }
}

const getFriendRequests = async (req, res) => {
    const { userId, type } = req.params;
  
    try {
      const whereClause = {
        status: 'pending',
      };

      whereClause[type === 'incoming' ? 'to_user' : 'from_user'] = userId;
  
      const attributes = type === 'incoming' ? ['id', 'from_user', 'status'] : ['id', 'to_user', 'status'];
  
      const findRequests = await FriendRequests.findAll({
        where: whereClause,
        attributes,
      });
  
      return res.status(200).json(findRequests);
    } catch (error) {
      return res.status(500).json({
        error: error.message,
      });
    }
  };

  const updateFriendRequest = async (req,res) => {
    const { request_id, response } = req.body;

    try{
        const findRequest = await FriendRequests.findOne({
            where: {id:request_id,status:enumsFriends.pending}
        })

        if(!findRequest) return res.status(201).send(`Friend request foundn't`);

        await FriendRequests.update({status:response},{
            where: {id:request_id}
        })

        return res.status(201).send(`Friend request: ${response}`);
    }catch(error){
        return res.status(500).json({
            error: error.message
        })
    }

  }

// const getAll = async (req, res) => {
//     try {
//         const users = await Users.findAll({
//             attributes: ['username', 'email', 'password']
//         });
//         if (!res.headersSent) {
//             res.status(201).json({
//                 status: res.statusCode,
//                 users
//             })
//         }
//     } catch (error) {
//         res.status(500).json({
//             error: error.message
//         })
//     }

// }

export {
    login,
    register,
    logout,
    getUserAuthentication,
    sendFriendRequest,
    getFriendRequests,
    updateFriendRequest
};
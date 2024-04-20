import Joi from "joi"

const schema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required()
});


export const validateCredentials = async (req, res, next) => {

    const {error} = schema.validate(req.body);
    if(error){
        return res.status(200).json({ error: error.details[0].message.replace(/"/g, '') });
    }
    next();
}
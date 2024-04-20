import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { PlusIcon } from "@heroicons/react/24/solid";
import MyToolTip from "../Tooltip.jsx";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverDescription,
  PopoverHeading,
  PopoverElement,
} from "../Popover.tsx";
import { LoadingIcon } from "../CustomIcons.jsx";
import usersApi from "../../api/users.js";
import chatApi from "../../api/chats.js";
import { useChatList } from "../../store/store.jsx";
import { useSocket } from "../../hooks/useSocket.jsx";


const colors = ["#ff674574", "#9750e985", "#5f6ade6e"];

const ChatList = () => {
  const { user } = useOutletContext();
  const [friendList, setFriendList] = useState(null);
  const [friendLoading, setFriendLoading] = useState(false);
  const navigate = useNavigate();
  const data = useChatList((state)=> state.data);
  const fetchChatList = useChatList((state)=> state.fetchData);


  const createChat = async (target) => {
    if(data.length>0)return navigate(`/c/${data.map(ele=>ele.chat_id)}`);
    try {
      await chatApi.createChat({
        target_user: target.id,
      });
    } catch (error) {
      console.log(id)
    }
  };

  const getFriends = async () => {
    setFriendLoading(true);
    try {
      const res = await usersApi.myFriends();
      if (res) {
        const { data } = res;
        setFriendList(data);
        setFriendLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleGetChat = (ele) => {
    navigate(`/c/${ele.chat_id}`)
  };

  useEffect(()=>{
    fetchChatList();
  },[])

  return (
    <section className="flex flex-col gap-4 pt-12">
      <header>
        <h1 className="text-3xl font-bold p-2">Chats</h1>
      </header>
      <Popover crossAxis={30}>
        <div className="flex justify-end">
          <PopoverTrigger
            onClick={() => {
              getFriends();
            }}
          >
            <MyToolTip content={"Start conversation"} position={"left"}>
              <PlusIcon className="w-6" />
            </MyToolTip>
          </PopoverTrigger>
          <PopoverContent className="bg-white shadow-lg overflow-hidden rounded-2xl border border-gray-200 relative max-w-64 min-w-64 ">
            <PopoverHeading>
              <div className="p-4">
                <span className="text-lg font-bold">{"New chat"}</span>
              </div>
            </PopoverHeading>
            {!friendLoading ? (
              <PopoverDescription className="py-3 flex flex-col bg-slate-100">
                {friendList?.length > 0 ? (
                  friendList?.map((ele, index) => (
                    <div key={index}>
                      <PopoverElement>
                        <div
                          onClick={() => createChat(ele)}
                          className="flex p-2 gap-2 items-end cursor-pointer hover:bg-gray-200"
                        >
                          <div
                            style={{ background: colors[1] }}
                            className="flex text-white justify-center items-center rounded-full overflow-hidden shadow-xl w-8 h-8 relative"
                          >
                            <span className="text-xs font-semibold">
                              {ele.username.split("")[0].toUpperCase()}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm flex flex-grow font-[500] border-gray-200">
                              {ele.username}
                            </span>
                            <span className="text-xs flex flex-grow text-gray-400 text-left max-w-[200px]">{`${index} aaaaaasdadasdads Life could be a dream ✨`}</span>
                          </div>
                        </div>
                      </PopoverElement>
                      <div
                        className={`flex justify-end ${
                          friendList.length - 1 === index ? "hidden" : ""
                        } py-1`}
                      >
                        <div className="border-b border-gray-200 w-4/5"></div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex justify-center items-center">
                    <span className="text-xs py-4">{`You don't have friends yet`}</span>
                  </div>
                )}
              </PopoverDescription>
            ) : (
              <PopoverDescription className="min-h-20 flex items-center justify-center">
                <div className="w-6">
                  <LoadingIcon />
                </div>
              </PopoverDescription>
            )}
            {/* <PopoverClose className='absolute -top-3 -right-3'>
              <div className='p-1 border border-gray-300 rounded-full bg-white'>
                <XMarkIcon className='w-4' />
              </div>
            </PopoverClose> */}
          </PopoverContent>
        </div>
      </Popover>

      {user ? (
        <div className="flex flex-col gap-2">
          {data?.map((ele, index) => (
            <div
              onClick={() => handleGetChat(ele)}
              key={index}
              className="flex gap-4 items-center hover:bg-gray-100 rounded-md cursor-pointer"
            >
              <div
                style={{ background: colors[1] }}
                className="flex text-white justify-center items-center rounded-full overflow-hidden shadow-xl w-10 h-10 relative ml-2"
              >
                <span className="text-xl font-semibold">
                  {ele.username.split("")[0]?.toUpperCase()}
                </span>
              </div>
              <div className="border-b py-2 flex flex-col flex-grow border-gray-100 mr-2">
                <div className="flex justify-between">
                  <h1 className="text-md font-bold">{ele.username}</h1>
                  <span
                    className={`text-sm ${
                      ele.is_online ? "text-green-500" : "text-red-500"
                    } `}
                  >
                    {ele.is_online ? "online" : "offline"}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {ele.context}
                  <span
                    style={{ visibility: ele.context ? "hidden" : "visible" }}
                  >
                    &nbsp;
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div>{"No users"}</div>
      )}
    </section>
  );
};

export default ChatList;

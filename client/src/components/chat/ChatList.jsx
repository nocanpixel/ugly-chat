import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ClipboardDocumentIcon, PlusIcon } from "@heroicons/react/24/solid";
import MyToolTipButton from "../TooltipButton.jsx";
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
import MyToolTip from "../Tooltip.jsx";
import {
  useTransition,
  useSpring,
  useChain,
  config,
  animated,
  useSpringRef,
} from "@react-spring/web";

const colors = ["#ff674574", "#9750e985", "#5f6ade6e"];

const dummyData = [
  {
    id: 1,
    name: "Billy wonka",
    tag: "billy#20j3",
  },
  {
    id: 2,
    name: "Mandy rapa",
    tag: "mandy#2m91",
  },
  {
    id: 3,
    name: "Youma",
    tag: "you#kj11",
  },
];

const ChatList = () => {
  const { user } = useOutletContext();
  const [friendList, setFriendList] = useState(null);
  const [friendLoading, setFriendLoading] = useState(false);
  const navigate = useNavigate();
  const data = useChatList((state) => state.data);
  const fetchChatList = useChatList((state) => state.fetchData);
  const textRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [searchFriend, setSearchFriend] = useState([]);

  const createChat = async (target) => {
    if (data.length > 0)
      return navigate(`/c/${data.map((ele) => ele.chat_id)}`);
    try {
      const res = await chatApi.createChat({
        target_user: target.id,
      });
      if (res) {
        navigate(`/c/${res.data[0].chat_id}`);
      }
    } catch (error) {
      console.log(id);
    }
  };

  const copyTag = async () => {
    try {
      console.log(textRef.current);
      await navigator.clipboard.writeText(textRef.current?.innerText);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Error reading clipboard:", error);
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
    navigate(`/c/${ele.chat_id}`);
  };

  const handleSearch = () => {};

  useEffect(() => {
    if (!data) {
      fetchChatList();
    }
  }, [data]);

  return (
    <section className="flex flex-col gap-4 pt-12">
      <header className="p-2">
        <h1 className="text-3xl font-bold">Chats</h1>
        <div className="flex items-center">
          <MyToolTip
            position="right"
            content={copied ? "User tag copied!" : "Click to copy!"}
          >
            <div
              onClick={copyTag}
              className="flex items-center justify-center pl-2 rounded-md hover:bg-indigo-100 cursor-pointer gap-2 p-2"
            >
              <span
                ref={textRef}
                id="user-tag"
                className="text-xs text-indigo-500 font-semibold"
              >{`${user.res.tag}`}</span>
              <ClipboardDocumentIcon className="w-4 fill-indigo-500" />
            </div>
          </MyToolTip>
        </div>
      </header>
      <div className="flex flex-col gap-2 relative">
        <div>
          <input
            className="w-full outline-none focus:ring-2 text-gray-500 focus:ring-indigo-400  caret-indigo-600 text-xs py-2 px-2 bg-gray-100 rounded-lg hover:ring-2 hover:ring-offset-1 hover:ring-indigo-400  "
            placeholder="Search friend by tag name name#1010"
            type="text"
          />
        </div>
        {searchFriend.length > 0 && (
          <div className="relative">
            <div className="absolute top-0 bg-white w-full min-h-[8rem] z-10 rounded-lg shadow-lg border py-2 ">
              {searchFriend.map((friend) => (
                <div key={friend.id} className="text-xs w-full border-b border-gray-100 hover:bg-gray-100 p-2 flex items-center gap-3">
                  <div
                    style={{ background: colors[1] }}
                    className="flex text-white justify-center items-center rounded-full overflow-hidden shadow-xl w-8 h-8 relative ml-2"
                  >
                    <span className="text-[17px] font-semibold">{"C"}</span>
                  </div>
                  <div className="flex flex-row flex-grow items-center">
                    <div className="flex flex-col flex-grow">
                      <span className="text-[13px] font-semibold">
                        {"Camilo Carreno"}
                      </span>
                      <span className=" text-gray-400">{"camilo#20K2"}</span>
                    </div>
                    <div className="px-2 py-1 bg-indigo-500 hover:opacity-80 hover:shadow-lg rounded-lg cursor-pointer ">
                      <span className="text-white text-[10px] font-semibold">
                        {"Add as friend"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Popover crossAxis={30}>
        <div className="flex justify-end">
          <PopoverTrigger
            onClick={() => {
              getFriends();
            }}
          >
            <MyToolTipButton
              withStyle={false}
              content={"Start conversation"}
              position={"left"}
            >
              <PlusIcon className="w-6" />
            </MyToolTipButton>
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
                <span className="text-sm text-gray-500 overflow-hidden whitespace-nowrap overflow-ellipsis max-w-52">
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

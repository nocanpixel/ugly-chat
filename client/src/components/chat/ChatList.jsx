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
import { DoubleCheckIcon, LoadingIcon } from "../CustomIcons.jsx";
import usersApi from "../../api/users.js";
import chatApi from "../../api/chats.js";
import { useChatList } from "../../store/store.jsx";
import MyToolTip from "../Tooltip.jsx";
import { useSocket } from "../../hooks/useSocket.jsx";
import MyModal from "../MyModal.jsx";

const colors = ["#ff674574", "#9750e985", "#5f6ade6e"];

const ChatList = () => {
  const { user } = useOutletContext();
  const [friendList, setFriendList] = useState(null);
  const [friendLoading, setFriendLoading] = useState(false);
  const navigate = useNavigate();
  const data = useChatList((state) => state.data);
  const fetchChatList = useChatList((state) => state.fetchData);
  const updateOpenChats = useChatList((state) => state.updateUserOffset);
  const updateMessageSeen = useChatList((state) => state.updateOnSeen);
  const textRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [queryUser, setQueryUser] = useState(null);
  const [inputSearch, setInputSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [qError, setqError] = useState(undefined);
  const [qSuccess, setqSuccess] = useState(undefined);

  const socket = useSocket();

  const createChat = async (target) => {
    try {
      const res = await chatApi.createChat({
        target_user: target.id,
      });
      if (res.data) {
        navigate(`/c/${res.data}`);
      }
      // if (res.data.findChat) {
      //   navigate(`/c/${res.data.findChat.chat_id}`);
      // }
    } catch (_) {
      return `Error ${_}`;
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    setQueryUser(formData.get("query"));
  };

  const copyTag = async () => {
    try {
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

  const handleGetChat = async (ele) => {
    try {
      const res = await chatApi.checkChat({ chatId: ele.chat_id });
      if (res.data === "Ok") {
        navigate(`/c/${ele.chat_id}`);
      }
    } catch (_) {
      return console.log(_);
    }
  };

  useEffect(() => {
    fetchChatList();
  }, [user]);

  useEffect(() => {
    async function searchUser() {
      if (!queryUser) return;
      const res = await socket.emitWithAck("user:search", {
        q: queryUser,
      });
      if (res?.data?.qStatus === "ERROR" || res.status === "ERROR") {
        setqError(res.data.info);
        setIsOpen(true);
        setqSuccess(undefined);
      } else {
        setqSuccess(res.data.info);
        setqError(undefined);
      }
    }

    searchUser();

    return () => {
      socket.off("user:search", searchUser);
    };
  }, [queryUser]);

  useEffect(() => {
    function ackMessage(data) {
      updateOpenChats(data);
      if (data.first) {
        fetchChatList();
      }
    }

    function ackSeenMessage(data) {
      updateMessageSeen(data);
    }

    socket.on("message:ackSeen", ackSeenMessage);
    socket.on("message:ack", ackMessage);

    return () => {
      socket.off("message:ack", ackMessage);
      socket.off("message:ackSeen", ackSeenMessage);
    };
  }, []);

  return (
    <section className="flex flex-col gap-2 pt-12">
      <MyModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <span className="text-gray-500 text-sm text-center">{qError}</span>
      </MyModal>
      <div className="px-3 flex flex-col gap-2">
        <header className="flex flex-col gap-2">
          <div className="flex gap-2 items-center">
            <h1 className="text-3xl font-bold">Chats</h1>
            <Popover placement="bottom" crossAxis={40}>
              <div className="flex justify-end">
                <PopoverTrigger
                  onClick={() => {
                    getFriends();
                  }}
                >
                  <MyToolTipButton
                    withTooltip={true}
                    withStyle={false}
                    content={"Start conversation"}
                    position={"right"}
                  >
                    <PlusIcon className="w-6" />
                  </MyToolTipButton>
                </PopoverTrigger>
                <PopoverContent className="bg-white shadow-lg overflow-hidden rounded-2xl border border-gray-200 relative max-w-64 min-w-64 z-10">
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
                                  <span className="text-xs flex flex-grow text-gray-400 text-left max-w-[200px]">{`${index} Life could be a dream ✨`}</span>
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
          </div>
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
        <form onSubmit={handleSubmit}>
          <div className="flex relative w-full justify-between items-center bg-gray-100 rounded-lg">
            <input
              className={`outline-none flex flex-grow py-[6px] px-[6px] rounded-lg ${
                qSuccess && "ring-1 ring-green-500"
              } ${
                qError && "ring-1 ring-red-500"
              } border border-gray-300 hover:ring-2 hover:ring-indigo-200 focus:ring-2 focus:ring-indigo-500  bg-gray-100 text-gray-500 caret-indigo-600 text-sm`}
              placeholder="name#1010"
              type="text"
              maxLength={20}
              value={inputSearch}
              name="query"
              onChange={(ele) => setInputSearch(ele.target.value)}
            />
            <div className="bg-indigo-500 absolute right-[2px] px-2 text-white rounded-lg hover:opacity-80 hover:shadow-md cursor-pointer">
              <button
                type="submit"
                className="text-xs font-semibold flex items-center justify-center py-[6px]"
              >
                {"Send Request"}
              </button>
            </div>
          </div>
          <div>
            {qError && (
              <p
                className={` mt-[2px] ${
                  qError && "text-red-600"
                } w-[28em] text-xs`}
              >
                {qError}
              </p>
            )}
            {qSuccess && (
              <p
                className={`${
                  qSuccess && "text-green-600"
                } mt-[2px] w-[28em] text-xs`}
              >
                {qSuccess}
              </p>
            )}
          </div>
        </form>
      </div>
      <div className="flex flex-col mt-1">
        {data && (
          <>
            {data?.map((ele, index) => (
              <div
                onClick={() => handleGetChat(ele)}
                key={index}
                className="flex gap-4 px-3 items-center hover:bg-gray-100 rounded-md cursor-pointer"
              >
                <div
                  style={{ background: colors[1] }}
                  className="flex text-white justify-center items-center rounded-full overflow-hidden shadow-xl w-8 h-8 relative"
                >
                  <span className="text-md font-semibold">
                    {ele.username.split("")[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="border-b py-3 flex flex-col flex-grow border-gray-100 mr-2">
                  <div className="flex justify-between items-center">
                    <h1 className="text-sm font-bold">{ele.username}</h1>
                    {/* <span
                      className={`text-sm rounded-full w-2 h-2 ${
                        ele.is_online ? "bg-green-300" : "bg-gray-300"
                      } `}
                    >
                    </span> */}
                    <div>
                      {ele.n_message_offset > 0 && (
                        <div className="relative bg-[#53bdeb] w-[18px] h-[18px] flex items-center justify-center rounded-full">
                          <span className="text-[10px] text-white">
                            {ele.n_message_offset}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className={`max-w-[10em] flex items-center gap-1`}>
                      {ele?.from_user === user.res.id && (
                        <span className="w-5 -rotate-11">
                          <DoubleCheckIcon
                            className={`${
                              ele.seen ? "stroke-[#53bdeb]" : "stroke-gray-400"
                            }`}
                          />
                        </span>
                      )}
                      <span
                        className={`text-xs ${
                          ele.n_message_offset
                            ? "text-[#53bdeb]"
                            : "text-gray-500"
                        } overflow-hidden whitespace-nowrap overflow-ellipsis`}
                      >
                        {ele.context?ele.context:(
                          <span className="text-gray-400 italic" >{'Empty chat'}</span>
                        )}
                      </span>
                    </div>
                    <span className="text-[12px] text-gray-500">
                      {ele.time}
                      <span
                        style={{
                          visibility: ele.context ? "hidden" : "visible",
                        }}
                      >
                        &nbsp;
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </section>
  );
};

export default ChatList;

import React, { useCallback, useEffect, useRef, useState } from "react";
import chatApi from "../../api/chats";
import {
  ChatBox,
  InputChat,
  InputSection,
  MessageSection,
  SenderDetail,
} from "../../styles";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSocket } from "../../hooks/useSocket";

export const MyChat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [allMessages, setAllMessages] = useState(null);
  const { user } = useOutletContext();
  const chatBoxRef = useRef(null);
  const socket = useSocket();
  const [payload, setPayload] = useState(null);

  const fetchDataConvo = useCallback(async () => {
    try {
      const response = await chatApi.getMessages(chatId);
      setAllMessages(response.data);
    } catch (errpr) {
      navigate("/404");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (event.target.querySelector(".editable").innerText.trim() === "") return;
    let message = event.target.querySelector(".editable").innerText;
    setPayload({
      chat_id: chatId,
      context: message,
    });
    event.target.querySelector(".editable").innerText = "";
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (event.target.innerText === "") return;
      const message = event.target.innerText;
      setPayload({
        chat_id: chatId,
        context: message,
      });
      event.target.innerText = "";
    }
  };

  useEffect(() => {
    fetchDataConvo();
  }, []);

  useEffect(() => {
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [allMessages]);

  useEffect(() => {
    async function sendMessage() {
      if (!payload) return;
      const res = await socket.emitWithAck("message:send", payload);
      if (res) {
        setAllMessages((prev) => [...prev, res.data]);
        setPayload(null);
      }
    }
    sendMessage();

    return () => {
      socket.off("message:send", sendMessage);
    };
  }, [payload]);

  const handleSentMessage = (message) => {
    setAllMessages((prev) => [...prev, message]);
  };

  useEffect(() => {
    async function sentMessage() {
      socket.on("message:sent", handleSentMessage);
    }
    sentMessage();
    return () => {
      socket.off("message:sent", handleSentMessage);
    };
  }, []);

  return (
    <MessageSection>
      <ChatBox
        className="relative flex flex-col px-3 pb-2 pt-[4.2rem] h-full overflow-y-auto"
        ref={chatBoxRef}
      >
        {allMessages?.map((message, index) =>
          user.res.id === message.userId ? (
            <div
              key={index}
              className={`${
                allMessages && message.userId !== allMessages[index + 1]?.userId
                  ? "mb-2"
                  : "mb-[2px]"
              }`}
            >
              <div className="w-full flex justify-end">
                <div
                  className={`flex items-start flex-col max-w-[270px] leading-3 p-2 border-gray-200 bg-gray-100 dark:bg-gray-200/[0.6] ${
                    allMessages &&
                    message.userId !== allMessages[index - 1]?.userId
                      ? "rounded-s-xl rounded-br-xl"
                      : "rounded-xl"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <p
                      style={{ overflowWrap: "anywhere" }}
                      className="text-sm text font-normal text-gray-600 dark-text-gray-400 whitespace-normal "
                    >
                      {message.context}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              key={index}
              className={`${
                allMessages && message.userId !== allMessages[index + 1]?.userId
                  ? "mb-2"
                  : "mb-[2px]"
              }`}
            >
              <div className="w-full flex justify-start">
                <div
                  className={`flex items-start flex-col max-w-[270px] p-2 border-gray-200 bg-gray-100 dark:bg-gray-200/[0.6] ${
                    allMessages &&
                    message.userId !== allMessages[index - 1]?.userId
                      ? "rounded-e-xl rounded-es-xl"
                      : "rounded-xl"
                  }`}
                >
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <p
                      style={{ overflowWrap: "anywhere" }}
                      className="text-sm whitespace-normal font-normal text-gray-600 dark-text-gray-400"
                    >
                      {message.context}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </ChatBox>
      <form onSubmit={handleSubmit}>
        <InputSection className="px-3">
          <div className="flex flex-grow gap-2 items-end">
            <div className="flex-grow">
              <InputChat
                onKeyDown={handleKeyDown}
                contentEditable
                value
                role="textbox"
                className="px-4 py-1 caret-indigo-500 text-sm hover:ring hover:ring-offset-1 hover:ring-indigo-400 editable"
              />
            </div>
            <button
              type="submit"
              className="p-[6px] rounded-full bg-indigo-500 cursor-pointer active:opacity-70 flex items-center justify-center"
            >
              <PaperAirplaneIcon className="w-4 text-white" />
            </button>
          </div>
        </InputSection>
      </form>
    </MessageSection>
  );
};

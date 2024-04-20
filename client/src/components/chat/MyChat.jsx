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

export const MyChat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [allMessages, setAllMessages] = useState(null);
  const { user } = useOutletContext();
  const chatBoxRef = useRef(null);


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
    if(event.target.querySelector(".editable").innerText.trim()==="")return;
    try {
      await chatApi.sendMessage({
        chatId: chatId,
        context: event.target.querySelector(".editable").innerText.trim(),
      });
      event.target.querySelector(".editable").innerText = "";
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if(event.target.innerText==="")return;
      try {
        const response = await chatApi.sendMessage({
          chatId: chatId,
          context: event.target.innerText,
        });
        if (response) {
          setAllMessages(prev=>[...prev, response.data]);
          event.target.innerText = "";
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    fetchDataConvo();
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat box container when allMessages change
    chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  }, [allMessages]);

  return (
    <MessageSection>
      <ChatBox className="relative flex flex-col gap-2 px-3 pb-2 pt-[4.2rem] h-full overflow-y-auto" ref={chatBoxRef}>
        {allMessages?.map((message,index) =>
          user.res.id === message.userId ? (
            <div key={index} className="w-full flex justify-end">
              <div className="flex items-start flex-col max-w-[270px] leading-3 p-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-200/[0.6]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <p className="text-sm font-normal text-gray-600 dark-text-gray-400">
                    {message.context}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div key={index} className="w-full flex justify-start">
              <div className="flex items-start flex-col max-w-[270px] leading-3 p-2 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl dark:bg-gray-200/[0.6]">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <p className="text-sm font-normal text-gray-600 dark-text-gray-400">
                    {message.context}
                  </p>
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
                className="px-4 text-sm hover:ring hover:ring-offset-1 hover:ring-indigo-400 editable"
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

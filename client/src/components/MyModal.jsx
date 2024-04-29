import React, { useState } from "react";
import { useTransition, animated } from "@react-spring/web";
import styled from "styled-components";

const MyModal = ({ isOpen, setIsOpen, children }) => {
  const transition = useTransition(isOpen, {
    from: {
      scale: 0,
      opacity: 0,
    },
    enter: {
      scale: 1,
      opacity: 1,
    },
    leave: {
      scale: 0,
      opacity: 0,
    },
  });

  return (
    <div>
      {transition((style, isOpen) => (
        <>
          {isOpen ? (
            <OverlayBackground
              onClick={() => setIsOpen(false)}
              style={{ opacity: style.opacity }}
            />
          ) : null}
          {isOpen ? (
            <div className="absolute flex justify-center items-center top-0 bottom-36 left-0 right-0">
              <Content className={"shadow-lg"} style={style}>
                <div className="px-4 flex flex-col justify-center items-center py-8 gap-4">
                  <h1 className="text-lg font-semibold text-gray-600">Friend request Failed</h1>
                    {children}
                </div>
                <div className="bg-gray-200 w-full py-4 px-4 flex justify-center">
                  <span onClick={()=> {setIsOpen(false)}} className="bg-indigo-600 w-full flex items-center justify-center text-white py-3 rounded-md cursor-pointer hover:bg-indigo-700 shadow-lg">
                    {"Okay"}
                  </span>
                </div>
              </Content>
            </div>
          ) : null}
        </>
      ))}
    </div>
  );
};

export default MyModal;

const OverlayBackground = styled(animated.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

const Content = styled(animated.div)`
  position: absolute;
  min-width: 20em;
  max-width: 22em;
  background-color: #fafafa;
  border-radius: 8px;
  z-index: 10;
  overflow: hidden;
`;

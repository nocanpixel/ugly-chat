import { styled } from "styled-components";

export const LayoutSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 100%;
  height: 100vh;
`;

export const LayoutContainer = styled.div`
  min-width: 90%;
  background-color: #fcfcfc;
  border-radius: 30px;
  overflow: hidden;
  @media (min-width: 600px) {
    min-width: 360px;
  }
`;

export const LayoutHeader = styled.div`
  height: 60px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px 0 12px;
  background: rgba(255, 255, 255, 0.648);
  backdrop-filter: blur(3.1px);
  -webkit-backdrop-filter: blur(3.1px);
  z-index: 10;
  gap: 0.5em;
`;

export const LayoutBody = styled.div`
  height: 88vh;
  padding: 0 12px 0px 12px;
`;

export const AuthSection = styled.section`
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 3em;
  min-height: 88vh;
  padding: 0px 12px 0px 12px;
`;

//MESSAGES VIEW

export const MessageSection = styled.section`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

export const ChatBox = styled.section`

`;

export const InputSection = styled.div`
  height: auto;
  width: 100%;
  background-color: #f4f4f4;
  padding-top: 0.8rem;
  padding-bottom: 1.5rem;
  min-height: 5.4rem;
`;

export const InputChat = styled.span`
  display: block;
  max-width: 285px;
  align-items: center;
  overflow: auto; /* Use 'auto' to allow vertical scrollbar if content overflows */
  background-color: white;
  border: 1px solid #ccc;
  resize: none; /* Allow vertical resizing */
  border-radius: 20px;
  padding-top: 4px;
  padding-bottom: 4px;
  outline: none;
  max-height: 7em;
  color: #35334ebe;

  &:focus {
    box-shadow: var(--tw-ring-inset) 0 0 0
      calc(2px + var(--tw-ring-offset-width)) rgb(129 140 248);
      
  }
`;


export const SenderDetail = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  height: 60px;
`
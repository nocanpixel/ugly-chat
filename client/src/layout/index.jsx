import React, { useEffect, useState } from "react";
import {
  LayoutSection,
  LayoutBody,
  LayoutContainer,
  LayoutHeader,
  SenderDetail,
} from "../styles";
import { Outlet, useLocation, useParams } from "react-router-dom";
import {
  ArrowLeftEndOnRectangleIcon,
  ArrowLeftIcon,
  EllipsisHorizontalCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { withAuthentication } from "../helpers/withAuthentication";
import usersApi from "../api/users";
import MyToolTipButton from "../components/TooltipButton";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "../components/Popover";
import { useChatList } from "../store/store";
import { SocketProvider } from "../context/SocketProvider";
import { Cookie } from "../utils/tools";

const cookie = new Cookie();

const Layout = withAuthentication((props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { chatId } = useParams();
  const currentLocation = ["/friends-requests", `/c/${chatId}`];
  const chatUrl = `/c/${chatId}`;
  const data = useChatList((state) => state.data);
  const fetchUser = useChatList((state) => state.fetchData);

  const logout = async () => {
    try {
      const response = await usersApi.logout();
      if(response){
        cookie.authCookies(0);
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  useEffect(() => {
    if(location){
      fetchUser();
    }
  }, [location]);

  return (
    <LayoutSection>
      <LayoutContainer className="relative">
        <LayoutHeader>
          {currentLocation.includes(location.pathname) ? (
            <div onClick={() => navigate(-1)} className="cursor-pointer">
              <ArrowLeftIcon className="w-6 fill-indigo-400" />
            </div>
          ) : (
            <Popover crossAxis={100} placement="bottom">
              <PopoverTrigger>
                <MyToolTipButton withTooltip={false}>
                  <EllipsisHorizontalCircleIcon className="w-6" />
                </MyToolTipButton>
              </PopoverTrigger>
              <PopoverContent className="bg-white shadow-lg p-2 rounded-lg border border-gray-200 relative min-w-56">
                <div
                  onClick={() => logout()}
                  className="flex gap-2 items-center hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  <ArrowLeftEndOnRectangleIcon className="w-6 fill-indigo-400" />
                  <span className="text-sm text-gray-400 flex-grow py-2 hover:text-gray-600">
                    {"Logout"}
                  </span>
                </div>
              </PopoverContent>
            </Popover>
          )}
          {location.pathname === chatUrl && (
            <SenderDetail className=" flex-grow ">
              <div
                style={{ background: "tomato" }}
                className="flex text-white justify-center items-center rounded-full overflow-hidden shadow-xl w-8 h-8 relative ml-2"
              >
                <span className="text-sm font-semibold">
                  {data && data[0]?.username?.split("")[0]?.toUpperCase()}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold">
                  {data && data[0]?.username}
                </span>
                <span className="text-[10px] text-gray-400">
                  {data && data[0]?.is_online ? "Online" : ""}
                </span>
              </div>
            </SenderDetail>
          )}
          <MyToolTipButton
            withTooltip={true}
            withStyle={true}
            onClick={() => currentLocation[0] !== location.pathname && navigate("/friends-requests")}
            content={"Friend request"}
            position={"left"}
          >
            <UsersIcon className="w-6" />
          </MyToolTipButton>
        </LayoutHeader>
        <LayoutBody>
          <SocketProvider>
            <Outlet context={{ ...props }} />
          </SocketProvider>
        </LayoutBody>
      </LayoutContainer>
      <span className="absolute bottom-6 left-0 w-full flex justify-center items-center text-xs text-slate-400">
        {"Camilo chat v1.0"}
      </span>
    </LayoutSection>
  );
});

export default Layout;

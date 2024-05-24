import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import {
  ImageMessageSvg,
  TextMessageSent,
  TextMessageSvgReceived,
} from "../svgs/chatSvg";
interface ChatProps {
  chat: any;
}

const Chat: React.FC<ChatProps> = ({ chat }) => {
  const userToChat = chat?.participants[0];
  const lastMessage = chat?.lastMessage;
  const lastMessageType = lastMessage?.messageType;
  const isMsgOpened = lastMessage?.opened;
  const amISender = lastMessage && lastMessage.sender._id !== userToChat?._id;
  const formattedDate = lastMessage
    ? formatDate(lastMessage?.createdAt!)
    : formatDate(new Date());

  let iconComponent: JSX.Element;
  let MessageStatus: string;

  if (amISender) {
    MessageStatus = isMsgOpened ? "Opened" : "Sent";

    iconComponent =
      lastMessageType === "text" ? (
        <TextMessageSent
          className={
            isMsgOpened ? "text-sigSnapChat" : "text-sigSnapChat fill-current"
          }
        />
      ) : (
        <ImageMessageSvg
          className={
            isMsgOpened ? "text-sigSnapImg" : "text-sigSnapImg fill-current"
          }
        />
      );
  } else {
    if (!lastMessage) {
      iconComponent = <TextMessageSvgReceived />;
      MessageStatus = "Say Hi!";
    } else {
      MessageStatus = isMsgOpened ? "Opened" : "Sent";
      iconComponent =
        lastMessageType === "text" ? (
          <TextMessageSvgReceived
            className={
              isMsgOpened ? "text-sigSnapChat" : "text-sigSnapChat fill-current"
            }
          />
        ) : (
          <ImageMessageSvg
            className={
              isMsgOpened ? "text-sigSnapImg" : "text-sigSnapImg fill-current"
            }
          />
        );
    }
  }

  return (
    <>
      <Link href={`/chat/${userToChat?._id}`}>
        <li className="flex items-center p-2  bg-sigSurface hover:bg-sigBackgroundFeedHover cursor-pointer border-b border-b-sigColorBgBorder">
          <Avatar className="w-14 h-14 bg-black">
            <AvatarImage
              src={
                userToChat?.avatar ||
                "https://questhowth.ie/wp-content/uploads/2018/04/user-placeholder.png"
              }
            />
          </Avatar>

          <div className="ml-3">
            <p>{userToChat?.fullname}</p>
            <p className="flex gap-1 text-gray-400 text-xs">
              {iconComponent}
              {MessageStatus} - {formattedDate}
            </p>
          </div>
          <Image
            src={"/camera.svg"}
            height={0}
            width={0}
            style={{ width: "20px", height: "auto" }}
            className="ml-auto hover:scale-95 "
            alt="Camera Icon"
          />
        </li>
      </Link>
    </>
  );
};

export default Chat;

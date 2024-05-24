import { auth } from "@/auth";
import { getUserForSideBar } from "@/lib/data";
import React from "react";
import Chat from "./chat";
import { resolve } from "path";

// sleep function (for testing in dev)
// const sleep = async (ms: number): Promise<void> => {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// };

const Chats = async () => {
  const session = await auth();
  const chats = session?.user ? await getUserForSideBar(session?.user._id) : [];

  return (
    <nav className="flex-1 overflow-y-auto">
      {chats &&
        chats.map((chat) => {
          return <Chat key={chat._id} chat={chat}></Chat>;
        })}
    </nav>
  );
};

export default Chats;

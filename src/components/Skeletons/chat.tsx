import React from "react";
import { Skeleton } from "../ui/skeleton";

const ChatFallback = () => {
  return (
    <div className="flex flex-col gap-3 px-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div className="flex items-center space-x-4" key={i}>
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-5 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatFallback;

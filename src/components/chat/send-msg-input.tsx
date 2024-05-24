"use client";
import Image from "next/image";
import { EmojiPopover } from "./emoji-popover";
import { TextMessageSent } from "../svgs/chatSvg";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { sendMessageAction } from "@/lib/actions";
import { useParams } from "next/navigation";
import { Loader } from "lucide-react";
import { readFileAsDataURL } from "@/lib/utils";
import ImagePreviewDialogInChat from "./send-image-from-chat";
// import ImagePreviewDialog from "./image-preview-dialog"; // modified to "ImagePreviewDialogInChat"

const SendMsgInput = () => {
  const [messageContent, setMessageContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const receiverId = params.id;
  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      setLoading(true);
      await sendMessageAction(receiverId, messageContent, "text");
      setMessageContent("");
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // feature to send image in a chat
  const imgRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<string>("");
  const [step, setStep] = useState(0);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const dataUrl = await readFileAsDataURL(file);
      setSelectedFile(dataUrl);
    }
  };

  const closeDialog = () => {
    setSelectedFile("");
    setStep(0);
  };
  return (
    <div className="flex gap-2 items-center py-1">
      <div
        className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center bg-sigBackgroundSecondaryHover"
        onClick={() => imgRef.current!.click()}
      >
        <Image
          src={"/camera.svg"}
          height={0}
          width={0}
          style={{ width: "20px", height: "auto" }}
          alt="camera icon"
        />
        <input
          type="file"
          accept="image/*"
          hidden
          ref={imgRef}
          onChange={handleFileChange}
        />
      </div>
      <form
        onSubmit={handleSendMessage}
        className="flex-1 flex  items-center gap-1 bg-sigBackgroundSecondaryHover rounded-full border   border-sigColorBgBorder"
      >
        <Input
          placeholder="Send a chat"
          className="bg-transparent focus:outline-transparent border-none outline-none w-full h-full rounded-full"
          type="text"
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          disabled={loading}
        />
        <Button
          size={"sm"}
          className="bg-transparent hover:bg-transparent text-sigSnapChat"
          type="submit"
        >
          {!loading && <TextMessageSent className=" scale-150 mr-1" />}
          {loading && <Loader className="h-6 w-6 animate-spin" />}
        </Button>
      </form>
      <div className="cursor-pointer w-10 h-10 rounded-full flex items-center justify-center text-white bg-sigBackgroundSecondaryHover">
        <EmojiPopover />
      </div>

      {
        <ImagePreviewDialogInChat
          selectedFile={selectedFile}
          onClose={closeDialog}
          onImageChange={() => imgRef.current!.click()}
          setStep={setStep}
          params={params}
          inChat
        />
      }
    </div>
  );
};
export default SendMsgInput;

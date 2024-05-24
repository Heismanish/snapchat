import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { sendMessageAction } from "@/lib/actions";

interface ImagePreviewDialogProps {
  selectedFile: string;
  onClose: () => void;
  onImageChange: () => void;
  setStep?: React.Dispatch<React.SetStateAction<number>>;
  inChat?: boolean;
  params?: { id: string };
}

const ImagePreviewDialogInChat: React.FC<ImagePreviewDialogProps> = ({
  selectedFile,
  onClose,
  onImageChange,
  setStep,
  inChat,
  params,
}) => {
  const handleSendMessage = async () => {
    try {
      await sendMessageAction(params?.id!, selectedFile, "image");
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={!!selectedFile}>
      <DialogContent
        className=" bg-sigMain border border-sigColorBgBorder md:max-w-3xl max-w-xl h-[80vh] flex flex-col "
        onInteractOutside={onClose}
      >
        <DialogHeader className="flex-1">
          <div className="flex items-center relative h-3/4 my-auto">
            <Image
              src={selectedFile!}
              alt="Selected File"
              fill
              className="rounded-md border mx-auto border-sigColorBgBorder object-contain"
            />
          </div>
        </DialogHeader>
        <DialogFooter className="mx-auto flex items-center">
          <DialogClose asChild>
            <Button
              variant="destructive"
              size={"sm"}
              onClick={onClose}
              className="rounded-full bg-sigSnapImg"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            size={"sm"}
            onClick={onImageChange}
            className="rounded-full px-4"
          >
            Change
          </Button>

          {inChat ? (
            <Button
              size={"sm"}
              onClick={() => {
                handleSendMessage();
              }}
              className="rounded-full bg-sigSnapChat px-4  hover:bg-sigSnapChat "
            >
              Send
            </Button>
          ) : (
            <Button
              size={"sm"}
              className="rounded-full bg-sigSnapChat px-4  hover:bg-sigSnapChat "
              onClick={() => setStep && setStep(1)}
            >
              Next
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePreviewDialogInChat;

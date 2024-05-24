import Message, { IMessageDocument } from "@/models/messageModel";
import User, { IUserDocument } from "@/models/userModel";
import { connectToMongoDB } from "./db";
import Chat, { IChatDocument } from "@/models/chatSchema";

export const getUserForSideBar = async (authUserId: string) => {
  try {
    // fetch all user excenpt the authentcated user
    const allUser: IUserDocument[] = await User.find({
      _id: { $ne: authUserId },
    });

    // fetch all the users with their last messages.
    const userInfo = await Promise.all(
      allUser.map(async (user) => {
        const lastMessage: IMessageDocument | null = await Message.findOne({
          $or: [
            { sender: user._id, receiver: authUserId },
            { sender: authUserId, receiver: user._id },
          ],
        })
          .sort({ createdAt: -1 })
          .populate("sender", "fullname avatar _id")
          .populate("receiver", "fullname avatar _id")
          .exec(); // exec() returns a promise to work around with async/await

        // return an object with desired values only
        return {
          _id: user._id,
          participants: [user],
          lastMessage: lastMessage
            ? {
                ...lastMessage.toJSON(),
                sender: lastMessage.sender,
                receiver: lastMessage.receiver,
              }
            : null,
        };
      })
    );

    // return the array of all users
    return userInfo;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getUserProfile = async (userId: string) => {
  try {
    await connectToMongoDB();
    const user: IUserDocument | null = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMessages = async (authUserId: string, otherUserId: string) => {
  try {
    await connectToMongoDB();

    const chat: IChatDocument | null = await Chat.findOne({
      participants: { $all: [authUserId, otherUserId] },
    }).populate({
      path: "messages", // message:["1231","1231"] => messages:[[{sender:{fullname:"Manish"}}]]
      populate: { path: "sender", model: "User", select: "fullname" },
    });

    if (!chat) return [];

    const messages = chat.messages;

    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    throw error;
  }
};

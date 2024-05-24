import { auth } from "@/auth";
import { connectToMongoDB } from "@/lib/db";
import User, { IUserDocument } from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request, res: Response) {
  try {
    const session = await auth();
    if (!session) {
      return;
    }

    await connectToMongoDB();

    const users: IUserDocument[] = await User.find({});

    // filter the authenticated user

    const filteredUser = users.filter(
      (user) => user._id.toString() !== session.user._id.toString()
    );

    return NextResponse.json(filteredUser);
  } catch (error) {
    console.log("Error fertchingall users:", error);
    throw error;
  }
}

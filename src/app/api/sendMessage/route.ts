import connection from "@/lib/Database";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/model/User";
// --------------------------------

connection(); // database connection

// --------------------------------

export async function POST(request: NextRequest) {
  console.log("something got wrong");

  try {
    const { username, content } = await request.json();

    const user = await UserModel.findOne({ username });

    if (!user) {
      return NextResponse.json(
        { message: "user not found", success: false },
        { status: 404 }
      );
    }

    // is user accepting a message

    if (!user?.isAcceptingMessage) {
      return NextResponse.json(
        { message: "user not accepting messages", success: false },
        { status: 403 }
      );
    } else {
      await UserModel.findByIdAndUpdate(
        user.id,
        { messages: user.messages.push(content) },
        { new: true }
      );

      return NextResponse.json(
        { message: "message send successfully", success: true },
        { status: 201 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
}

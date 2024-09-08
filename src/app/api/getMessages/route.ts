import connection from "@/lib/Database";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

// -------------------------------------

connection(); // database connection

// -------------------------------------

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    const user = session?.user;

    if (!session || !user) {
      return NextResponse.json(
        { message: "Not Authenticated", success: false },
        { status: 401 }
      );
    }

    const updatedUserInfo = await UserModel.aggregate([
      { $match: { id: user.id } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      { $group: { _id: "$_id", messages: { $push: "messages" } } },
    ]);

    if (!updatedUserInfo || updatedUserInfo.length === 0) {
      return NextResponse.json(
        { message: "user not found", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: updatedUserInfo[0].messages, success: true },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }

  // const isAcceptingMsg = await request.json();
  // console.log(isAcceptingMsg);
}

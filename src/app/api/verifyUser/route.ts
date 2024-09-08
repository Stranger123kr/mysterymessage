import connection from "@/lib/Database";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

// --------------------------------

connection(); // database connection

// --------------------------------

export async function POST(request: NextRequest) {
  try {
    const { username, otp } = await request.json();

    const decodedUsername = decodeURIComponent(username); // It's an optional

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found", success: false },
        { status: 404 }
      );
    }

    // -------------------------------------------

    let { verifyCode, verifyCodeExpiry } = user;

    const isCodeValid = verifyCode === otp;
    const isCodeExpiryValid = verifyCodeExpiry > new Date();

    // -------------------------------------------

    if (!isCodeExpiryValid) {
      return NextResponse.json(
        { message: "Otp has expired", success: false },
        { status: 410 }
      );
    } else if (!isCodeValid) {
      return NextResponse.json(
        { message: "This Otp is Invalid ", success: false },
        { status: 401 }
      );
    } else {
      user.isVerified = true;
      await user.save();
      return NextResponse.json(
        { message: "Verification Successfully", success: true },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
}

import connection from "@/lib/Database";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
// -------------------------------------

connection(); // database connection

const GetOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

// -------------------------------------

export async function POST(request: NextRequest) {
  try {
    const { username, email, password } = await request.json();

    // -------------------------

    const CheckUsername = await UserModel.findOne({ username });

    if (CheckUsername) {
      return NextResponse.json(
        { message: "This Username Already Taken Try Another", success: false },
        { status: 409 }
      );
    }

    // -------------------------

    const CheckEmail: any = await UserModel.findOne({ email });

    if (CheckEmail) {
      return NextResponse.json(
        { message: "User Already SignUp", success: false },
        { status: 409 }
      );
    } else {
      const salt = await bcrypt.genSalt(12);
      const hashPassword = await bcrypt.hash(password, salt);

      const expiryDate = new Date();
      expiryDate.setHours(expiryDate.getHours() + 1);

      const RegisterUser = new UserModel({
        username,
        email,
        password: hashPassword,
        verifyCode: GetOtp(),
        verifyCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      await RegisterUser.save();

      //   --------------------------------------

      const { id }: any = await UserModel.findOne({ email }); // find user for verification

      const emailToken = jwt.sign(
        { Nitesh: true, userId: id },
        process.env.TOKEN_SECRET!,
        {
          expiresIn: "1h",
        }
      );

      cookies().set("EmailToken", emailToken, {
        httpOnly: true,
      });

      //   --------------------------------------
      await sendVerificationEmail(username, email, GetOtp());
      // send verification code via email

      return NextResponse.json(
        {
          message:
            "User SignUp Successfully. Please Verify Your Email To Login",
          emailNotification: "Verify Your Email",
          success: true,
        },
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

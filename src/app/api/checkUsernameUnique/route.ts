import connection from "@/lib/Database";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { usernameValidation } from "@/schemas/signUpSchema";
import { z } from "zod";
// --------------------------------

connection(); // database connection

// --------------------------------

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

// --------------------------------

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const user = {
      username: searchParams.get("username"),
    };

    const result = UsernameQuerySchema.safeParse({ username: user.username });

    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];

      return NextResponse.json(
        {
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(" ,")
              : "Invalid username formate",
          success: false,
        },
        { status: 404 }
      );
    }

    const { username } = result.data;

    const CheckUsernameUnique = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (CheckUsernameUnique) {
      return NextResponse.json(
        { message: "username has been taken ", success: false },
        { status: 409 }
      );
    } else {
      return NextResponse.json(
        { message: "username available", success: true },
        { status: 200 }
      );
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
}

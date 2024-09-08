import connection from "@/lib/Database";
import UserModel from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";

// -------------------------------------

connection(); // database connection

// -------------------------------------

export async function POST(request: NextRequest) {
  console.log("something got wrong");
  try {
    const session = await getServerSession(authOptions);

    console.log(session);

    const user = session?.user;

    if (!session || !user) {
      return NextResponse.json(
        { message: "Not Authenticated", success: false },
        { status: 401 }
      );
    }

    const isAcceptingMsg = await request.json();
    console.log(isAcceptingMsg);

    if (isAcceptingMsg) {
      const updatedUser = await UserModel.findByIdAndUpdate(
        user.id,
        { isAcceptingMessage: isAcceptingMsg },
        { new: true }
      );

      if (!updatedUser) {
        return NextResponse.json(
          {
            message: "failed to update user status to accept message",
            success: false,
          },
          { status: 401 }
        );
      }

      return NextResponse.json(
        {
          message: isAcceptingMsg
            ? "Accepting Message On"
            : "Accepting Message Off",
          success: true,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.log(error);
    console.log(error.statusCode);
    return NextResponse.json(
      { message: error.message, success: false },
      { status: 500 }
    );
  }
}

// -------------------------------------

// export async function GET(request: NextRequest) {
//   console.log("something got wrong");
//   try {
//     const session = await getServerSession(authOptions);

//     const user = session?.user;

//     if (!session || !user) {
//       return NextResponse.json(
//         { message: "Not Authenticated", success: false },
//         { status: 401 }
//       );
//     }

//     if (user.isAcceptingMessage) {
//       const updatedUser = await UserModel.findById(user.id);

//       if (!updatedUser) {
//         return NextResponse.json(
//           {
//             message: "user not found",
//             success: false,
//           },
//           { status: 401 }
//         );
//       }

//       return NextResponse.json(
//         {
//           success: true,
//         },
//         { status: 200 }
//       );
//     }
//   } catch (error: any) {
//     console.log(error);
//     console.log(error.statusCode);
//     return NextResponse.json(
//       { message: error.message, success: false },
//       { status: 500 }
//     );
//   }
// }

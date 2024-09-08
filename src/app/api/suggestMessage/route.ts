import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages } from 'ai';
import UserModel from "@/model/User";
import connection from "@/lib/Database";
import { NextRequest, NextResponse } from "next/server";

// --------------------------------

connection(); // database connection

// --------------------------------

// export async function POST(request: NextRequest) {
//   try {
//     return NextResponse.json({ message: "message sent" }, { status: 200 });
//   } catch (error) {
//     console.log(error);
//     return NextResponse.json(
//       { message: "something went wrong" },
//       { status: 500 }
//     );
//   }
// }




// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4-turbo'),
    messages: convertToCoreMessages(messages),
  });

  return result.toDataStreamResponse();
}


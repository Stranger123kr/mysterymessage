import { resend } from "@/lib/resend";
import EmailVerificationTemp from "../../emails/EmailVerificationTemp";
import { ApiResponse } from "@/types/ApiResponse";
export const sendVerificationEmail = async (
  username: string,
  email: string,
  otp: string
) => {
  console.log(username);
  console.log(otp);

  try {
    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Mystery message Email Verification Process",
      react: EmailVerificationTemp({ username, otp }),
    });

    console.log(data + "MILA");

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(
      { success: true, message: "Verification email send successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return Response.json(
      { success: false, message: "Failed to send verification email", error },
      { status: 500 }
    );
  }
};

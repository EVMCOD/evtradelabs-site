import { NextResponse } from "next/server";
import { sendLicenseEmail, LicenseEmailData } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const data: LicenseEmailData = await request.json();
    const result = await sendLicenseEmail(data);
    return NextResponse.json(result);
  } catch (err) {
    console.error("Email API error:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}

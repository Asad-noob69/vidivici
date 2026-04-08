import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { sendEmail } from "@/lib/email"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { to, subject, message } = body

    if (!to || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields (to, subject, message)" }, { status: 400 })
    }

    const html = `
      <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="font-size: 24px; font-weight: 700; color: #1a1a1a; letter-spacing: 2px; margin: 0;">VIDI VICI</h1>
          <p style="font-size: 11px; color: #999; letter-spacing: 3px; margin: 4px 0 0;">LUXURY RENTALS</p>
        </div>
        <div style="background: #fafafa; border-radius: 12px; padding: 30px; border: 1px solid #eee;">
          ${message.split("\n").map((line: string) => `<p style="font-size: 14px; color: #333; line-height: 1.7; margin: 0 0 12px;">${line}</p>`).join("")}
        </div>
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="font-size: 11px; color: #999;">VIDI VICI &mdash; Luxury Car &amp; Villa Rentals</p>
          <p style="font-size: 11px; color: #bbb;">Los Angeles &amp; Miami</p>
        </div>
      </div>
    `

    await sendEmail({ to, subject: `[VIDI VICI] ${subject}`, html })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Send customer email error:", error)
    return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

type FormData = {
  name: string;
  business?: string;
  email: string;
  concern: string;
  decider?: string;
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

async function sendEmail(data: FormData) {
  const { name, business, email, concern, decider } = data;

  const html = `
    <h2>New conversation request</h2>
    <p><strong>Name:</strong> ${name}</p>
    ${business ? `<p><strong>Business:</strong> ${business}</p>` : ""}
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>What's happening:</strong></p>
    <p>${concern.replace(/\n/g, "<br>")}</p>
    ${decider ? `<p><strong>Decision maker:</strong> ${decider}</p>` : ""}
  `;

  const text = `
New conversation request

Name: ${name}
${business ? `Business: ${business}\n` : ""}Email: ${email}

What's happening:
${concern}
${decider ? `\nDecision maker: ${decider}` : ""}
  `.trim();

  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    replyTo: email,
    subject: `New lead: ${name}${business ? ` (${business})` : ""}`,
    text,
    html,
  });
}

async function sendSlack(data: FormData) {
  const { name, business, email, concern, decider } = data;

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) return;

  const text = [
    `✨ *Request Received!*`,
    `🎉 *${name}*${business ? ` · ${business}` : ""} — ${email}`,
    `🗣️ ${concern}`,
    decider ? `🫂 ${decider}` : "",
  ].filter(Boolean).join("\n");

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
}

export async function POST(req: NextRequest) {
  try {
    const data: FormData = await req.json();

    if (!data.name || !data.email || !data.concern) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await Promise.all([sendEmail(data), sendSlack(data)]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Form submission error:", error);
    return NextResponse.json({ error: "Failed to send" }, { status: 500 });
  }
}

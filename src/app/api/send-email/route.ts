import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, center, formType } = body;

    // Validation
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, phone" },
        { status: 400 }
      );
    }

    // SMTP Configuration from environment variables
    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587", 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpFrom = process.env.SMTP_FROM || process.env.EMAIL_FROM || `"DIDM Noida Leads" <leads@didm.in>`;
    const smtpTo = process.env.SMTP_TO || process.env.ADMIN_EMAIL || "info@didm.in"; // destination email

    if (!smtpUser || !smtpPass) {
      console.warn("SMTP credentials (SMTP_USER or SMTP_PASS) not configured. Email NOT sent. Lead details:", body);
      return NextResponse.json({
        success: true,
        message: "Request received successfully (simulated SMTP success)",
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465, // true for 465, false for other ports
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const mailOptions = {
      from: smtpFrom,
      to: smtpTo,
      subject: `New Lead: ${formType || "Inquiry Form"} - ${name}`,
      text: `
New Form Submission Details:
---------------------------------------------
Form Type: ${formType || "Inquiry"}
Full Name: ${name}
Email Address: ${email}
Mobile Phone: ${phone}
Training Center: ${center || "Noida"}
Submission Date: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}
---------------------------------------------
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e4e4e7; border-radius: 12px; padding: 24px; color: #18181b;">
          <h2 style="color: #dc2626; margin-top: 0; border-bottom: 2px solid #f4f4f5; padding-bottom: 12px;">New DIDM Noida Lead</h2>
          <p style="font-size: 14px; color: #71717a;">A user has submitted an inquiry on the DIDM Noida landing page.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563; font-size: 14px; width: 140px;">Form Type:</td>
              <td style="padding: 8px 0; color: #18181b; font-size: 14px;">${formType || "Inquiry"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563; font-size: 14px;">Full Name:</td>
              <td style="padding: 8px 0; color: #18181b; font-size: 14px;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563; font-size: 14px;">Email:</td>
              <td style="padding: 8px 0; color: #18181b; font-size: 14px;"><a href="mailto:${email}" style="color: #dc2626; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563; font-size: 14px;">Mobile Phone:</td>
              <td style="padding: 8px 0; color: #18181b; font-size: 14px;"><a href="tel:${phone}" style="color: #dc2626; text-decoration: none;">${phone}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563; font-size: 14px;">Selected Center:</td>
              <td style="padding: 8px 0; color: #18181b; font-size: 14px;">${center || "Noida"}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #4b5563; font-size: 14px;">Submitted At:</td>
              <td style="padding: 8px 0; color: #18181b; font-size: 14px;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</td>
            </tr>
          </table>
          
          <div style="margin-top: 30px; padding-top: 15px; border-top: 1px solid #f4f4f5; text-align: center; font-size: 11px; color: #a1a1aa;">
            DIDM Noida Admissions Desk Lead Management System.
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, message: "Email sent successfully" });
  } catch (error: any) {
    console.error("Error sending email:", error);
    return NextResponse.json({ error: error.message || "Failed to send email" }, { status: 500 });
  }
}

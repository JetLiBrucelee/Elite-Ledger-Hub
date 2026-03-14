import { Router } from "express";

const contactRouter = Router();

contactRouter.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    console.warn("RESEND_API_KEY not set — contact form submission logged but email not sent");
    console.log("Contact form submission:", { name, email, subject, message });
    return res.json({ success: true });
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(resendApiKey);

    await resend.emails.send({
      from: "Elite Ledger Capital <support@eliteledgercapital.com>",
      to: "support@eliteledgercapital.com",
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
      replyTo: email,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return res.status(500).json({ error: "Failed to send message. Please try again later." });
  }
});

export default contactRouter;

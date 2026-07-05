/**
 * POST /api/feedback
 * Receives feedback from frontend, validates, then sends via EmailJS
 * using the feedback-specific service & template.
 */

export const submitFeedback = async (req, res) => {
  try {
    const { name, email, type, subject, message, rating, page } = req.body;

    // Basic validation
    if (!message || typeof message !== "string" || message.trim().length < 5) {
      return res.status(400).json({ error: "Message is required (min 5 characters)." });
    }
    if (message.trim().length > 3000) {
      return res.status(400).json({ error: "Message too long (max 3000 characters)." });
    }

    const feedbackType = type || "other";
    const feedbackSubject = subject?.trim() || "(no subject)";
    const senderName = name?.trim() || "Anonymous";
    const senderEmail = email?.trim() || "Not provided";
    const ratingStr = rating ? `${rating}/5` : "Not rated";
    const pageContext = page?.trim() || "Not specified";
    const sentAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // Send via EmailJS using feedback-specific template
    const serviceId = process.env.EMAILJS_FEEDBACK_SERVICE_ID;
    const templateId = process.env.EMAILJS_FEEDBACK_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_FEEDBACK_PUBLIC_KEY;

    if (!serviceId || !templateId || !publicKey) {
      // EmailJS not configured — still return success (log it server-side)
      console.log(`[Feedback] ${sentAt} | ${feedbackType} | From: ${senderName} <${senderEmail}>`);
      console.log(`[Feedback] Subject: ${feedbackSubject}`);
      console.log(`[Feedback] Message: ${message.trim()}`);
      return res.status(201).json({ ok: true, note: "Received (email not configured)" });
    }

    const requestBody = {
      service_id: serviceId,
      template_id: templateId,
      user_id: publicKey,
      template_params: {
        from_name: senderName,
        from_email: senderEmail,
        feedback_type: feedbackType,
        subject: feedbackSubject,
        message: message.trim(),
        rating: ratingStr,
        page_url: pageContext,
        sent_at: sentAt,
      },
    };

    if (process.env.EMAILJS_FEEDBACK_PRIVATE_KEY) {
      requestBody.accessToken = process.env.EMAILJS_FEEDBACK_PRIVATE_KEY;
    }

    const emailResponse = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    });

    if (!emailResponse.ok) {
      const errText = await emailResponse.text();
      console.error("EmailJS error:", emailResponse.status, errText);
      return res.status(502).json({ error: "Failed to send email. Please try again later." });
    }

    res.status(201).json({ ok: true });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};

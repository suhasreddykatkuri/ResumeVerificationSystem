import { mailtrapClient, sender } from "../mailtrap/mailtrap.config.js";

// Controller to handle sending a plain text email
export const sendPlainEmail = async (req, res) => {
  const { to, subject, message } = req.body;

  if (!to || !subject || !message) {
    return res.status(400).json({ message: "Missing required fields: 'to', 'subject', or 'message'." });
  }

  const recipients = Array.isArray(to) ? to : [to]; // Ensure 'to' is an array of recipients

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients.map(email => ({ email })),
      subject,
      text: message, // Use 'text' for plain text content
    });

    console.log("Email sent successfully", response);
    return res.status(200).json({ message: "Email sent successfully." });
  } catch (error) {
    console.error(`Error sending email`, error);
    return res.status(500).json({ message: "Error sending email.", error: error.message });
  }
};

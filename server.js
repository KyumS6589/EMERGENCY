import express from "express";
import bodyParser from "body-parser";
import twilio from "twilio";

const app = express();
app.use(bodyParser.json());

// Twilio credentials from your Twilio Console
const accountSid = "ACXXXXXXXXXXXXXXXXXXXXXXXX"; // <-- replace
const authToken = "your_auth_token";              // <-- replace
const client = twilio(accountSid, authToken);

// Replace with YOUR WhatsApp number
const YOUR_WHATSAPP_NUMBER = "whatsapp:+918171388267";  // 👈 your number

// Replace with your Twilio Sandbox WhatsApp number
const TWILIO_WHATSAPP = "whatsapp:+14155238886";

app.post("/api/emergency", async (req, res) => {
  try {
    const { latitude, longitude, mode } = req.body;

    const mapsUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    const message = `🚨 Emergency Alert (${mode})\nLocation: ${mapsUrl}`;

    // Send WhatsApp
    await client.messages.create({
      from: TWILIO_WHATSAPP,
      to: YOUR_WHATSAPP_NUMBER,
      body: message,
    });

    // Optional: send SMS too (if you have a Twilio phone number)
    // await client.messages.create({
    //   from: "+1234567890", // your Twilio phone number
    //   to: "+918171388267", // your phone number
    //   body: message,
    // });

    res.send({ status: "ok", sent: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 Server running on port 3000"));

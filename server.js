import express from "express";
import bodyParser from "body-parser";
import twilio from "twilio";

const app = express();
app.use(bodyParser.json());

// 🔑 Your Twilio credentials
const accountSid = "ACxxxxxxxxxxxx"; 
const authToken = "your_auth_token";
const client = twilio(accountSid, authToken);

// Emergency endpoint (called by the HTML page)
app.post("/api/emergency", async (req, res) => {
  try {
    const { latitude, longitude, mode } = req.body;

    const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    const message = `🚨 Emergency Alert (${mode})\nLocation: ${locationUrl}`;

    // WhatsApp send
    await client.messages.create({
      from: "whatsapp:+14155238886",  // Twilio WhatsApp sandbox
      to: "whatsapp:+918171388267",   // Your target number
      body: message,
    });

    // SMS send
    await client.messages.create({
      from: "+1234567890", // Your Twilio number
      to: "+918171388267", // Your target number
      body: message,
    });

    res.send({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

app.listen(3000, () => console.log("🚀 Server running on http://localhost:3000"));

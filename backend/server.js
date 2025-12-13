// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import cors from "cors";
import eventRoutes from "./routes/eventsRoute.js"; 
import organizersRoutes from "./routes/organizersRoute.js";
import { sendDiscordMessage } from "./discordBot/bot.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Large limit for PDF data
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// MongoDB connection
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MONGO_URI not found in .env");
  process.exit(1);
}

mongoose.connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Test email connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email server connection failed:', error);
  } else {
    console.log('✅ Email server is ready to send messages');
  }
});

// Routes
app.use("/organizers", organizersRoutes);
app.use("/events", eventRoutes); 

// Certificate email endpoint
app.post('/api/send-certificate', async (req, res) => {
  try {
    const { name, email, pdfData } = req.body;

    // Validate inputs
    if (!name || !email || !pdfData) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['name', 'email', 'pdfData']
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Convert base64 PDF to buffer
    const base64Data = pdfData.includes(',') 
      ? pdfData.split(',')[1] 
      : pdfData;
    
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    // Email content
    const mailOptions = {
      from: `"Certificate Authority" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `🎓 Certificate of Achievement - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎓 Congratulations!</h1>
            </div>
            <div class="content">
              <h2>Dear ${name},</h2>
              <p>We are delighted to present you with your <strong>Certificate of Achievement</strong>!</p>
              <p>Your dedication and hard work have been truly exceptional, and this certificate is a testament to your accomplishments.</p>
              <p>📎 Your certificate is attached to this email as a PDF document.</p>
              <p>Please download and save it for your records.</p>
              <br>
              <p>Warmest congratulations once again!</p>
              <p><strong>Best regards,</strong><br>
              The Organizing Team</p>
            </div>
            <div class="footer">
              <p>This is an automated email. Please do not reply to this message.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: `Certificate_${name.replace(/[^a-z0-9]/gi, '_')}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log(`✅ Certificate sent to ${email} (Message ID: ${info.messageId})`);

    res.status(200).json({
      success: true,
      message: `Certificate successfully sent to ${email}`,
      messageId: info.messageId,
    });

  } catch (error) {
    console.error('❌ Email sending error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      details: error.message,
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    email: process.env.EMAIL_USER ? 'configured' : 'not configured'
  });
});

// Test route
app.get("/", (req, res) => res.send("Server is running"));

app.get("/test-discord", () => {
  sendDiscordMessage("Test message from server");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

export default app;

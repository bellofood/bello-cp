import nodemailer from 'nodemailer';

// Gmail SMTP Configuration (More reliable than Mailtrap)
const GMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || "zeyadelnady2@gmail.com",
    pass: process.env.GMAIL_PASS || "your-gmail-app-password"
  }
};

// Try multiple Mailtrap configurations with different ports
const MAILTRAP_CONFIGS = [
  {
    name: "Mailtrap Port 587 (Most Compatible)",
    config: {
      host: "sandbox.smtp.mailtrap.io",
      port: 587,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER || "d145a3141ff346",
        pass: process.env.MAILTRAP_PASS || "your-mailtrap-password"
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    }
  },
  {
    name: "Mailtrap Port 2525 (Standard)",
    config: {
      host: "sandbox.smtp.mailtrap.io", 
      port: 2525,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER || "d145a3141ff346",
        pass: process.env.MAILTRAP_PASS || "your-mailtrap-password"
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000
    }
  },
  {
    name: "Mailtrap Port 25 (Fallback)",
    config: {
      host: "sandbox.smtp.mailtrap.io",
      port: 25,
      secure: false,
      auth: {
        user: process.env.MAILTRAP_USER || "d145a3141ff346",
        pass: process.env.MAILTRAP_PASS || "your-mailtrap-password"
      },
      connectionTimeout: 8000,
      greetingTimeout: 4000,
      socketTimeout: 8000
    }
  }
];

// Get the primary Mailtrap config (Port 587 - most likely to work)
const MAILTRAP_CONFIG = MAILTRAP_CONFIGS[0].config;

// Debug environment variables
console.log('📧 Email config debug:');
console.log('GMAIL_USER:', process.env.GMAIL_USER ? '✅ Set' : '❌ Not set');
console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '✅ Set' : '❌ Not set');

// Switch back to Gmail SMTP for real email delivery
console.log('🔄 Using Gmail SMTP for real email delivery...');
const transporter = nodemailer.createTransport(GMAIL_CONFIG);

// Sender configuration
const sender = {
  address: process.env.SENDER_EMAIL || "zeyadelnady2@gmail.com",
  name: process.env.SENDER_NAME || "Belloo Jobs Portal",
};

// Verify Gmail SMTP connection
export const verifyEmailConnection = async () => {
  try {
    console.log('🔍 Testing Gmail SMTP connection...');
    await transporter.verify();
    console.log('✅ Gmail SMTP server is ready to send emails');
    console.log('📧 Emails will be delivered to your Gmail account');
    return true;
  } catch (error) {
    console.error('❌ Gmail SMTP connection error:', error.message);
    
    // Provide specific troubleshooting advice
    if (error.code === 'EAUTH') {
      console.log('💡 Authentication failed - check your Gmail App Password');
      console.log('   → Make sure 2FA is enabled and you\'re using an App Password');
    } else if (error.code === 'ETIMEDOUT') {
      console.log('💡 Connection timeout - check your network connection');
    }
    
    return false;
  }
};

// Send job application notification email
export const sendJobApplicationNotification = async (applicationData, cvFile = null) => {
  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Job Application - Belloo</title>
    <style>
        body { font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f7f5f0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(77, 96, 44, 0.15); }
        .header { background: linear-gradient(135deg, #4D602C 0%, #6B7F3C 50%, #F1D2A9 100%); color: white; padding: 30px 25px; text-align: center; position: relative; }
        .logo-container { margin-bottom: 15px; }
        .logo { width: 120px; height: auto; filter: brightness(0) invert(1); }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header p { margin: 8px 0 0 0; opacity: 0.95; font-size: 16px; font-weight: 300; }
        .content { padding: 35px 30px; }
        .info-card { background: #faf9f6; border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 5px solid #4D602C; box-shadow: 0 2px 8px rgba(77, 96, 44, 0.08); }
        .info-row { display: flex; margin-bottom: 14px; align-items: flex-start; }
        .info-label { font-weight: 700; color: #4D602C; min-width: 110px; margin-right: 15px; font-size: 14px; }
        .info-value { color: #333333; flex: 1; font-size: 15px; }
        .position-badge { background: linear-gradient(135deg, #4D602C 0%, #6B7F3C 100%); color: white; padding: 8px 16px; border-radius: 25px; font-size: 13px; font-weight: 700; display: inline-block; text-transform: capitalize; letter-spacing: 0.5px; box-shadow: 0 2px 6px rgba(77, 96, 44, 0.3); }
        .cv-info { background: linear-gradient(135deg, #f0f7e8 0%, #e8f5e0 100%); border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 5px solid #4D602C; }
        .section-title { margin: 0 0 18px 0; color: #4D602C; font-size: 16px; font-weight: 700; display: flex; align-items: center; }
        .section-icon { margin-right: 8px; font-size: 18px; }
        .footer { background: linear-gradient(135deg, #F1D2A9 0%, #E8C598 100%); padding: 25px; text-align: center; color: #4D602C; font-size: 14px; font-weight: 500; }
        .timestamp { color: #6B7F3C; font-size: 13px; margin-top: 20px; text-align: right; font-weight: 500; }
        .contact-link { color: #4D602C; text-decoration: none; font-weight: 600; transition: color 0.3s ease; }
        .contact-link:hover { color: #6B7F3C; }
        .warning-box { background: linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%); border-left: 5px solid #F1D2A9; padding: 18px; border-radius: 8px; margin: 15px 0; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 12px; }
            .content { padding: 25px 20px; }
            .header { padding: 25px 20px; }
            .info-row { flex-direction: column; }
            .info-label { min-width: auto; margin-bottom: 5px; }
            .logo { width: 100px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 249.06 142.95">
                    <g fill="currentColor">
                        <path d="M166.89,33.46s-13.43,2.38-13.53,15.91v33.63s.5,10.76-7.01,18.7h19.21c2.12,0,3.84-1.72,3.84-3.84v-8.97h-.85s-.58,7.6-8.97,7.97h-7.33s8.6-6.16,9.77-12.59c.09-6.69.02-35.2,0-41.23,0-1.39.18-2.78.59-4.11.61-2.01,1.84-4.47,4.28-5.48Z"/>
                        <path d="M135.95,33.46s-13.43,2.38-13.53,15.91v33.63s.5,10.76-7.01,18.7h19.21c2.12,0,3.84-1.72,3.84-3.84v-8.97h-.85s-.58,7.6-8.97,7.97h-7.33s8.6-6.16,9.77-12.59c.09-6.69.02-35.2,0-41.23,0-1.39.18-2.78.59-4.11.61-2.01,1.84-4.47,4.28-5.48Z"/>
                        <path d="M154.21,25.65s-12.71.75-19.87,7.01c1.06-2.8,11.41-21.45,32.94-11.18-1.44,2.27-7.66,17.37-32.36,12.37.15-.78,9.49-6.34,19.29-8.2Z"/>
                        <path d="M120.89,37.03c-.22,2.26-.54,10.17,5.3,11.41,0,6.11-3.76,2.95-3.76,2.95,0,0-3.95-6.22-3.66-14.07.01-.28.22-.52.5-.57l1.09-.21c.3-.06.57.19.54.49Z"/>
                        <path d="M129.61,15.8s-10.86,13.28-9.21,22.12c.82-.91,13.19-7.53,16.22-17.03,1.34-3.69,3.36-10.65.86-14.97-2.15.25-9.9,1.61-15.33,9.24-3.53,4.96-4.91,11.14-4.04,17.17.31,2.15.64,3.77.64,3.77,0,0,1.28-12.14,10.86-20.29Z"/>
                        <path d="M118.75,45.09s-8.77-7.53-20.6-7.63c4.07,1.42,18.36,6.33,20.62,9.08-.19.08-.42.16-.69.23-5.84,1.58-29.1.58-33.8-13.31,0,0,9.16-6.53,23-.96,4.12,2.34,10.07,4.86,11.46,12.58Z"/>
                        <path d="M117.33,46.45s4.06,2.05,4.75,3.09c-.17-1.39-4.4-3.93-4.4-3.93l-.47.59.12.25Z"/>
                        <path d="M46.54,68.36c5.41-1.74,7.22-6.39,8.16-8.89,1.54-4.72.8-8.67-.43-11.61-1.55-3.71-4.32-6.79-7.83-8.76-4.25-2.39-8.44-2.69-11.24-2.81-6.27-.17-7.98.87-9.88,1.73-.15.07-.3.14-.45.21-6.25,3-10.15,9.4-10.15,16.33v37.03c-.59,5.56-4.42,10.12-4.42,10.12h31.51c11.35-.21,15.39-10,16.19-13.31,3.99-13.31-11.47-20.04-11.47-20.04ZM24.56,51.02c.3-9.59,6.92-10.26,8.91-10.4,9.4,0,11.84,8.07,12.26,10.56,1.14,9.94-4.87,14.39-9.73,17.91-10.68,7-11.43,9.22-11.43,9.22,0,0-.44-18.46,0-27.29ZM36.39,95.96c-7.7.51-11.5-5.03-11.82-11.23-.28-5.52,3.33-11.39,11.82-11.23,6.65.13,12.05,5.39,12.05,11.23,0,7.83-5.41,10.79-12.05,11.23Z"/>
                        <path d="M193.79,52.43s-10.49,10.42-4.35,29.85c1.45,4.26,4.52,15.18,18.68,17.06,2.73.09,10.49.6,15.86-8.7-.26,1.88-5.86,15.29-25.42,10.3-5.32-2.04-17.9-7.16-20.74-23.59-.5-2.77-3.01-17.04,9.1-23.76,1.43-.8,3.03-1.27,4.67-1.35.68-.03,1.25,0,2.2.2Z"/>
                        <path d="M191.89,41.21s17.82-8.48,31.16,10.86c2.61,4.24,9.7,20.47,2.91,33.11,3.14.13,12.39-1.32,12.79-17.85-.24-4.36-.67-16.57-17.58-25.94-4.95-2.75-10.49-4.32-16.16-4.35-4.65-.03-9.69.91-13.12,4.17Z"/>
                        <ellipse cx="213.11" cy="57.42" rx="7.65" ry="12.97" transform="translate(3.85 127.6) rotate(-33.62)"/>
                        <ellipse cx="208.4" cy="84.26" rx="12.34" ry="7.86" transform="translate(-11.79 129.48) rotate(-33.62)"/>
                        <path d="M104.75,56.37c1.66,1.74,3.3,4.46,2.08,7.85-.84-1.33-2.21-4.05-5.73-5.39-.96-.37-1.99-.54-3.02-.54h-14s-5.31.88-6.24,6.55v9.29h18.83c1.82,0,3.3,1.48,3.3,3.3h0c0,1.82-1.48,3.3-3.3,3.3h-18.94s0,4.53,0,4.53c0,6.16,4.99,11.15,11.15,11.15h8.91s5.82-1.29,8.27-6.29c.65,0,.73.22.52,2.03-.47,1.77-2.76,9.65-8.27,9.78h-19.43s-8.36-2.71-9.44-11.07v-25.16s.26-4.45,4.22-7.4c-1.46-1.46-3.29-2.13-7.28-1.92.7-1.14,3.17-4.14,7.92-4.95,3.77-.77,7.26,1.7,12.74,2.84h12.76c1.87,0,3.65.76,4.95,2.11Z"/>
                        <path d="M92.92,119.74v8.18h2.31c1.78,0,2.92-.96,3.05-1.45v3.35c-.13-.48-1.27-1.45-3.05-1.45h-2.31v6.09c0,1.47.48,2.44.96,2.56h-4.32c.48-.13.96-1.09.96-2.56v-12.64c0-1.47-.48-2.44-.96-2.56h11.4v.48l.3,3.5c-.51-1.9-2.16-3.5-4.72-3.5h-3.63Z"/>
                        <path d="M120.39,128.75c0,4.24-2.36,8.28-7.67,8.28s-7.72-4.52-7.72-9.01,2.51-8.76,7.72-8.76c4.85,0,7.67,4.85,7.67,9.5ZM119.02,130.83c0-4.49-3.22-10.33-8.02-10.33-3.15,0-4.52,2.49-4.52,5.46,0,4.44,3.07,10,8.05,10,3.2,0,4.49-2.29,4.49-5.13Z"/>
                        <path d="M140.2,128.75c0,4.24-2.36,8.28-7.67,8.28s-7.72-4.52-7.72-9.01,2.51-8.76,7.72-8.76c4.85,0,7.67,4.85,7.67,9.5ZM138.83,130.83c0-4.49-3.22-10.33-8.02-10.33-3.15,0-4.52,2.49-4.52,5.46,0,4.44,3.07,10,8.05,10,3.2,0,4.49-2.29,4.49-5.13Z"/>
                        <path d="M158.32,128.14c0,4.44-2.56,8.89-7.74,8.89h-6.27c.48-.13.96-1.09.96-2.56v-12.64c0-1.47-.48-2.44-.96-2.56h6.27c5.18,0,7.74,4.44,7.74,8.89ZM155.84,128.09c0-4.19-1.73-8.35-5.26-8.35h-2.92v16.81h2.92c3.5,0,5.26-4.24,5.26-8.45Z"/>
                        <polygon points="72.48 128.1 72.48 131.59 49.69 129.84 72.48 128.1"/>
                        <polygon points="199.37 129.84 176.58 131.59 176.58 128.1 199.37 129.84"/>
                    </g>
                </svg>
            </div>
            <h1>🎯 New Job Application Received</h1>
            <p>Someone has applied for a position at Belloo</p>
        </div>
        
        <div class="content">
            <div class="info-card">
                <h3 class="section-title">
                    <span class="section-icon">👤</span>
                    Applicant Information
                </h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value"><strong>${applicationData.name}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Title:</span>
                    <span class="info-value">${applicationData.title}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Position:</span>
                    <span class="info-value"><span class="position-badge">${applicationData.position.replace('-', ' ')}</span></span>
                </div>
                ${applicationData.company ? `
                <div class="info-row">
                    <span class="info-label">Company:</span>
                    <span class="info-value">${applicationData.company}</span>
                </div>
                ` : ''}
            </div>

            <div class="info-card">
                <h3 class="section-title">
                    <span class="section-icon">📞</span>
                    Contact Information
                </h3>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><a href="mailto:${applicationData.email}" class="contact-link">${applicationData.email}</a></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value"><a href="tel:${applicationData.phone}" class="contact-link">${applicationData.phone}</a></span>
                </div>
            </div>

            ${cvFile ? `
            <div class="cv-info">
                <h3 class="section-title">
                    <span class="section-icon">📎</span>
                    CV Attachment
                </h3>
                <div class="info-row">
                    <span class="info-label">File:</span>
                    <span class="info-value"><strong>${cvFile.name}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Size:</span>
                    <span class="info-value">${(cvFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <p style="margin: 12px 0 0 0; color: #6B7F3C; font-size: 14px; font-weight: 500;">
                    💡 The CV file is attached to this email and also stored in the admin dashboard.
                </p>
            </div>
            ` : `
            <div class="warning-box">
                <p style="margin: 0; color: #4D602C; font-weight: 600;">⚠️ No CV file was uploaded with this application.</p>
            </div>
            `}

            <div class="timestamp">
                📅 Submitted on: ${new Date().toLocaleString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short'
                })}
            </div>
        </div>

        <div class="footer">
            <p style="margin: 0; font-weight: 600;">This notification was automatically sent from the Belloo website job application form.</p>
            <p style="margin: 8px 0 0 0;">You can view all applications in the <strong>Admin Dashboard</strong>.</p>
        </div>
    </div>
</body>
</html>`;

    // Email options
    const mailOptions = {
      from: {
        name: sender.name,
        address: sender.address
      },
      to: process.env.JOBS_EMAIL || 'jobs@bello-food.com',
      subject: `🎯 New Job Application: ${applicationData.name} - ${applicationData.position.replace('-', ' ')}`,
      html: emailHtml,
      attachments: cvFile ? [{
        filename: cvFile.name,
        path: cvFile.path,
        contentType: cvFile.mimetype
      }] : []
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Job application email sent successfully:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId,
      preview: nodemailer.getTestMessageUrl(info) // Only for Ethereal test accounts
    };

  } catch (error) {
    console.error('❌ Error sending job application email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

// Send contact form notification email
export const sendContactFormNotification = async (contactData) => {
  try {
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Message - Belloo</title>
    <style>
        body { font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f7f5f0; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(77, 96, 44, 0.15); }
        .header { background: linear-gradient(135deg, #4D602C 0%, #6B7F3C 50%, #F1D2A9 100%); color: white; padding: 30px 25px; text-align: center; position: relative; }
        .logo-container { margin-bottom: 15px; }
        .logo { width: 120px; height: auto; filter: brightness(0) invert(1); }
        .header h1 { margin: 0; font-size: 26px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .header p { margin: 8px 0 0 0; opacity: 0.95; font-size: 16px; font-weight: 300; }
        .content { padding: 35px 30px; }
        .info-card { background: #faf9f6; border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 5px solid #4D602C; box-shadow: 0 2px 8px rgba(77, 96, 44, 0.08); }
        .info-row { display: flex; margin-bottom: 14px; align-items: flex-start; }
        .info-label { font-weight: 700; color: #4D602C; min-width: 110px; margin-right: 15px; font-size: 14px; }
        .info-value { color: #333333; flex: 1; font-size: 15px; }
        .section-title { margin: 0 0 18px 0; color: #4D602C; font-size: 16px; font-weight: 700; display: flex; align-items: center; }
        .section-icon { margin-right: 8px; font-size: 18px; }
        .message-box { background: linear-gradient(135deg, #e8f5e0 0%, #f0f7e8 100%); border-radius: 12px; padding: 24px; margin: 20px 0; border-left: 5px solid #4D602C; }
        .footer { background: linear-gradient(135deg, #F1D2A9 0%, #E8C598 100%); padding: 25px; text-align: center; color: #4D602C; font-size: 14px; font-weight: 500; }
        .timestamp { color: #6B7F3C; font-size: 13px; margin-top: 20px; text-align: right; font-weight: 500; }
        .contact-link { color: #4D602C; text-decoration: none; font-weight: 600; transition: color 0.3s ease; }
        .contact-link:hover { color: #6B7F3C; }
        @media (max-width: 600px) {
            .container { margin: 10px; border-radius: 12px; }
            .content { padding: 25px 20px; }
            .header { padding: 25px 20px; }
            .info-row { flex-direction: column; }
            .info-label { min-width: auto; margin-bottom: 5px; }
            .logo { width: 100px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-container">
                <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 249.06 142.95">
                    <g fill="currentColor">
                        <path d="M166.89,33.46s-13.43,2.38-13.53,15.91v33.63s.5,10.76-7.01,18.7h19.21c2.12,0,3.84-1.72,3.84-3.84v-8.97h-.85s-.58,7.6-8.97,7.97h-7.33s8.6-6.16,9.77-12.59c.09-6.69.02-35.2,0-41.23,0-1.39.18-2.78.59-4.11.61-2.01,1.84-4.47,4.28-5.48Z"/>
                        <path d="M135.95,33.46s-13.43,2.38-13.53,15.91v33.63s.5,10.76-7.01,18.7h19.21c2.12,0,3.84-1.72,3.84-3.84v-8.97h-.85s-.58,7.6-8.97,7.97h-7.33s8.6-6.16,9.77-12.59c.09-6.69.02-35.2,0-41.23,0-1.39.18-2.78.59-4.11.61-2.01,1.84-4.47,4.28-5.48Z"/>
                        <path d="M154.21,25.65s-12.71.75-19.87,7.01c1.06-2.8,11.41-21.45,32.94-11.18-1.44,2.27-7.66,17.37-32.36,12.37.15-.78,9.49-6.34,19.29-8.2Z"/>
                        <path d="M120.89,37.03c-.22,2.26-.54,10.17,5.3,11.41,0,6.11-3.76,2.95-3.76,2.95,0,0-3.95-6.22-3.66-14.07.01-.28.22-.52.5-.57l1.09-.21c.3-.06.57.19.54.49Z"/>
                        <path d="M129.61,15.8s-10.86,13.28-9.21,22.12c.82-.91,13.19-7.53,16.22-17.03,1.34-3.69,3.36-10.65.86-14.97-2.15.25-9.9,1.61-15.33,9.24-3.53,4.96-4.91,11.14-4.04,17.17.31,2.15.64,3.77.64,3.77,0,0,1.28-12.14,10.86-20.29Z"/>
                        <path d="M118.75,45.09s-8.77-7.53-20.6-7.63c4.07,1.42,18.36,6.33,20.62,9.08-.19.08-.42.16-.69.23-5.84,1.58-29.1.58-33.8-13.31,0,0,9.16-6.53,23-.96,4.12,2.34,10.07,4.86,11.46,12.58Z"/>
                        <path d="M117.33,46.45s4.06,2.05,4.75,3.09c-.17-1.39-4.4-3.93-4.4-3.93l-.47.59.12.25Z"/>
                        <path d="M46.54,68.36c5.41-1.74,7.22-6.39,8.16-8.89,1.54-4.72.8-8.67-.43-11.61-1.55-3.71-4.32-6.79-7.83-8.76-4.25-2.39-8.44-2.69-11.24-2.81-6.27-.17-7.98.87-9.88,1.73-.15.07-.3.14-.45.21-6.25,3-10.15,9.4-10.15,16.33v37.03c-.59,5.56-4.42,10.12-4.42,10.12h31.51c11.35-.21,15.39-10,16.19-13.31,3.99-13.31-11.47-20.04-11.47-20.04ZM24.56,51.02c.3-9.59,6.92-10.26,8.91-10.4,9.4,0,11.84,8.07,12.26,10.56,1.14,9.94-4.87,14.39-9.73,17.91-10.68,7-11.43,9.22-11.43,9.22,0,0-.44-18.46,0-27.29ZM36.39,95.96c-7.7.51-11.5-5.03-11.82-11.23-.28-5.52,3.33-11.39,11.82-11.23,6.65.13,12.05,5.39,12.05,11.23,0,7.83-5.41,10.79-12.05,11.23Z"/>
                        <path d="M193.79,52.43s-10.49,10.42-4.35,29.85c1.45,4.26,4.52,15.18,18.68,17.06,2.73.09,10.49.6,15.86-8.7-.26,1.88-5.86,15.29-25.42,10.3-5.32-2.04-17.9-7.16-20.74-23.59-.5-2.77-3.01-17.04,9.1-23.76,1.43-.8,3.03-1.27,4.67-1.35.68-.03,1.25,0,2.2.2Z"/>
                        <path d="M191.89,41.21s17.82-8.48,31.16,10.86c2.61,4.24,9.7,20.47,2.91,33.11,3.14.13,12.39-1.32,12.79-17.85-.24-4.36-.67-16.57-17.58-25.94-4.95-2.75-10.49-4.32-16.16-4.35-4.65-.03-9.69.91-13.12,4.17Z"/>
                        <ellipse cx="213.11" cy="57.42" rx="7.65" ry="12.97" transform="translate(3.85 127.6) rotate(-33.62)"/>
                        <ellipse cx="208.4" cy="84.26" rx="12.34" ry="7.86" transform="translate(-11.79 129.48) rotate(-33.62)"/>
                        <path d="M104.75,56.37c1.66,1.74,3.3,4.46,2.08,7.85-.84-1.33-2.21-4.05-5.73-5.39-.96-.37-1.99-.54-3.02-.54h-14s-5.31.88-6.24,6.55v9.29h18.83c1.82,0,3.3,1.48,3.3,3.3h0c0,1.82-1.48,3.3-3.3,3.3h-18.94s0,4.53,0,4.53c0,6.16,4.99,11.15,11.15,11.15h8.91s5.82-1.29,8.27-6.29c.65,0,.73.22.52,2.03-.47,1.77-2.76,9.65-8.27,9.78h-19.43s-8.36-2.71-9.44-11.07v-25.16s.26-4.45,4.22-7.4c-1.46-1.46-3.29-2.13-7.28-1.92.7-1.14,3.17-4.14,7.92-4.95,3.77-.77,7.26,1.7,12.74,2.84h12.76c1.87,0,3.65.76,4.95,2.11Z"/>
                        <path d="M92.92,119.74v8.18h2.31c1.78,0,2.92-.96,3.05-1.45v3.35c-.13-.48-1.27-1.45-3.05-1.45h-2.31v6.09c0,1.47.48,2.44.96,2.56h-4.32c.48-.13.96-1.09.96-2.56v-12.64c0-1.47-.48-2.44-.96-2.56h11.4v.48l.3,3.5c-.51-1.9-2.16-3.5-4.72-3.5h-3.63Z"/>
                        <path d="M120.39,128.75c0,4.24-2.36,8.28-7.67,8.28s-7.72-4.52-7.72-9.01,2.51-8.76,7.72-8.76c4.85,0,7.67,4.85,7.67,9.5ZM119.02,130.83c0-4.49-3.22-10.33-8.02-10.33-3.15,0-4.52,2.49-4.52,5.46,0,4.44,3.07,10,8.05,10,3.2,0,4.49-2.29,4.49-5.13Z"/>
                        <path d="M140.2,128.75c0,4.24-2.36,8.28-7.67,8.28s-7.72-4.52-7.72-9.01,2.51-8.76,7.72-8.76c4.85,0,7.67,4.85,7.67,9.5ZM138.83,130.83c0-4.49-3.22-10.33-8.02-10.33-3.15,0-4.52,2.49-4.52,5.46,0,4.44,3.07,10,8.05,10,3.2,0,4.49-2.29,4.49-5.13Z"/>
                        <path d="M158.32,128.14c0,4.44-2.56,8.89-7.74,8.89h-6.27c.48-.13.96-1.09.96-2.56v-12.64c0-1.47-.48-2.44-.96-2.56h6.27c5.18,0,7.74,4.44,7.74,8.89ZM155.84,128.09c0-4.19-1.73-8.35-5.26-8.35h-2.92v16.81h2.92c3.5,0,5.26-4.24,5.26-8.45Z"/>
                        <polygon points="72.48 128.1 72.48 131.59 49.69 129.84 72.48 128.1"/>
                        <polygon points="199.37 129.84 176.58 131.59 176.58 128.1 199.37 129.84"/>
                    </g>
                </svg>
            </div>
            <h1>💌 New Contact Message</h1>
            <p>Someone has sent a message through the contact form</p>
        </div>
        
        <div class="content">
            <div class="info-card">
                <h3 class="section-title">
                    <span class="section-icon">👤</span>
                    Contact Information
                </h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value"><strong>${contactData.name}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><a href="mailto:${contactData.email}" class="contact-link">${contactData.email}</a></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value"><a href="tel:${contactData.phone}" class="contact-link">${contactData.phone}</a></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Subject:</span>
                    <span class="info-value"><strong>${contactData.subject}</strong></span>
                </div>
            </div>

            <div class="message-box">
                <h3 class="section-title">
                    <span class="section-icon">💬</span>
                    Message
                </h3>
                <p style="margin: 0; white-space: pre-line; color: #333333; line-height: 1.6;">${contactData.message}</p>
            </div>

            <div class="timestamp">
                📅 Submitted on: ${new Date().toLocaleString()}
            </div>
        </div>

        <div class="footer">
            <p style="margin: 0; font-weight: 600;">This message was sent from the Belloo website contact form.</p>
        </div>
    </div>
</body>
</html>`;

    const mailOptions = {
      from: {
        name: sender.name,
        address: sender.address
      },
      to: process.env.CONTACT_EMAIL || 'info@bello-food.com',
      subject: `💌 New Contact: ${contactData.subject} - ${contactData.name}`,
      html: emailHtml,
      replyTo: contactData.email
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Contact form email sent successfully:', info.messageId);
    
    return {
      success: true,
      messageId: info.messageId
    };

  } catch (error) {
    console.error('❌ Error sending contact form email:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

export default { sendJobApplicationNotification, sendContactFormNotification, verifyEmailConnection };

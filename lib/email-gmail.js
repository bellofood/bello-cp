import nodemailer from 'nodemailer';

// Gmail SMTP Configuration (Alternative to Mailtrap)
const GMAIL_CONFIG = {
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
};

// Mailtrap SMTP Configuration with multiple ports
const MAILTRAP_CONFIG = {
  host: "sandbox.smtp.mailtrap.io",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.MAILTRAP_USER || "d145a3141ff346",
    pass: process.env.MAILTRAP_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000
};

// Choose transporter based on available credentials
const getTransporter = () => {
  if (process.env.GMAIL_USER && process.env.GMAIL_PASS) {
    console.log('🔄 Using Gmail SMTP...');
    return nodemailer.createTransport(GMAIL_CONFIG);
  } else {
    console.log('🔄 Using Mailtrap SMTP...');
    return nodemailer.createTransport(MAILTRAP_CONFIG);
  }
};

const transporter = getTransporter();

// Sender configuration
const sender = {
  address: process.env.SENDER_EMAIL || "zeyadelnady2@gmail.com",
  name: process.env.SENDER_NAME || "Belloo Jobs Portal",
};

// Verify connection with better error handling
export const verifyEmailConnection = async () => {
  try {
    console.log('🔍 Testing email connection...');
    await transporter.verify();
    console.log('✅ Email server is ready to send emails');
    return true;
  } catch (error) {
    console.error('❌ Email connection error:', error.message);
    
    // Provide specific troubleshooting advice
    if (error.code === 'ETIMEDOUT') {
      console.log('💡 Connection timeout - try these fixes:');
      console.log('   1. Check your firewall settings');
      console.log('   2. Try port 587 instead of 2525');
      console.log('   3. Use Gmail SMTP as alternative');
    } else if (error.code === 'EAUTH') {
      console.log('💡 Authentication failed - check your username/password');
    }
    
    return false;
  }
};

// Send job application notification email with better error handling
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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; }
        .info-card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 15px 0; border-left: 4px solid #007bff; }
        .info-row { display: flex; margin-bottom: 12px; }
        .info-label { font-weight: 600; color: #495057; min-width: 100px; margin-right: 15px; }
        .info-value { color: #212529; flex: 1; }
        .position-badge { background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; text-transform: capitalize; }
        .cv-info { background: #e8f5e8; border-radius: 8px; padding: 15px; margin: 15px 0; border-left: 4px solid #28a745; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px; }
        .timestamp { color: #6c757d; font-size: 13px; margin-top: 15px; text-align: right; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎯 New Job Application Received</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Someone has applied for a position at Belloo</p>
        </div>
        
        <div class="content">
            <div class="info-card">
                <h3 style="margin: 0 0 15px 0; color: #495057;">👤 Applicant Information</h3>
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
                <h3 style="margin: 0 0 15px 0; color: #495057;">📞 Contact Information</h3>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><a href="mailto:${applicationData.email}" style="color: #007bff; text-decoration: none;">${applicationData.email}</a></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value"><a href="tel:${applicationData.phone}" style="color: #28a745; text-decoration: none;">${applicationData.phone}</a></span>
                </div>
            </div>

            ${cvFile ? `
            <div class="cv-info">
                <h3 style="margin: 0 0 15px 0; color: #495057;">📎 CV Attachment</h3>
                <div class="info-row">
                    <span class="info-label">File:</span>
                    <span class="info-value"><strong>${cvFile.name}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Size:</span>
                    <span class="info-value">${(cvFile.size / 1024 / 1024).toFixed(2)} MB</span>
                </div>
                <p style="margin: 10px 0 0 0; color: #6c757d; font-size: 14px;">
                    💡 The CV file is attached to this email and also stored in the admin dashboard.
                </p>
            </div>
            ` : `
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; border-radius: 8px; margin: 15px 0;">
                <p style="margin: 0; color: #856404;">⚠️ No CV file was uploaded with this application.</p>
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
            <p style="margin: 0;">This notification was automatically sent from the Belloo website job application form.</p>
            <p style="margin: 5px 0 0 0;">You can view all applications in the <strong>Admin Dashboard</strong>.</p>
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

    // Send email with retry logic
    let retries = 2;
    let lastError;
    
    for (let i = 0; i <= retries; i++) {
      try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Job application email sent successfully:', info.messageId);
        
        return {
          success: true,
          messageId: info.messageId
        };
      } catch (error) {
        lastError = error;
        console.error(`❌ Email attempt ${i + 1} failed:`, error.message);
        
        if (i < retries) {
          console.log(`🔄 Retrying in 2 seconds...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
    }

    // All retries failed
    throw lastError;

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
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #007bff 0%, #6f42c1 100%); color: white; padding: 25px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
        .content { padding: 30px; }
        .info-card { background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 15px 0; border-left: 4px solid #007bff; }
        .info-row { display: flex; margin-bottom: 12px; }
        .info-label { font-weight: 600; color: #495057; min-width: 100px; margin-right: 15px; }
        .info-value { color: #212529; flex: 1; }
        .message-box { background: #e7f3ff; border-radius: 8px; padding: 20px; margin: 15px 0; border-left: 4px solid #007bff; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 14px; }
        .timestamp { color: #6c757d; font-size: 13px; margin-top: 15px; text-align: right; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💌 New Contact Message</h1>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">Someone has sent a message through the contact form</p>
        </div>
        
        <div class="content">
            <div class="info-card">
                <h3 style="margin: 0 0 15px 0; color: #495057;">👤 Contact Information</h3>
                <div class="info-row">
                    <span class="info-label">Name:</span>
                    <span class="info-value"><strong>${contactData.name}</strong></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Email:</span>
                    <span class="info-value"><a href="mailto:${contactData.email}" style="color: #007bff;">${contactData.email}</a></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Phone:</span>
                    <span class="info-value"><a href="tel:${contactData.phone}" style="color: #28a745;">${contactData.phone}</a></span>
                </div>
                <div class="info-row">
                    <span class="info-label">Subject:</span>
                    <span class="info-value"><strong>${contactData.subject}</strong></span>
                </div>
            </div>

            <div class="message-box">
                <h3 style="margin: 0 0 15px 0; color: #495057;">💬 Message</h3>
                <p style="margin: 0; white-space: pre-line; color: #212529;">${contactData.message}</p>
            </div>

            <div class="timestamp">
                📅 Submitted on: ${new Date().toLocaleString()}
            </div>
        </div>

        <div class="footer">
            <p style="margin: 0;">This message was sent from the Belloo website contact form.</p>
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

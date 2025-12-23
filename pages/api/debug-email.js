// Debug email configuration and test sending
export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('🔍 Debugging email configuration...');
      
      // Check all environment variables
      const envCheck = {
        GMAIL_USER: process.env.GMAIL_USER ? '✅ Set' : '❌ Missing',
        GMAIL_PASS: process.env.GMAIL_PASS ? '✅ Set' : '❌ Missing', 
        SENDER_EMAIL: process.env.SENDER_EMAIL || '❌ Not set',
        SENDER_NAME: process.env.SENDER_NAME || '❌ Not set',
        JOBS_EMAIL: process.env.JOBS_EMAIL || '❌ Not set',
        NODE_ENV: process.env.NODE_ENV || 'development'
      };
      
      console.log('📋 Environment Variables:', envCheck);
      
      return res.status(200).json({
        success: true,
        message: 'Environment check completed',
        environment: envCheck,
        serverTime: new Date().toISOString(),
        isVercel: process.env.VERCEL === '1'
      });
      
    } catch (error) {
      console.error('❌ Debug failed:', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
  
  if (req.method === 'POST') {
    try {
      // Test email sending with manual configuration
      const nodemailer = require('nodemailer');
      
      console.log('📧 Testing Gmail SMTP...');
      
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER || "zeyadelnady2@gmail.com",
          pass: process.env.GMAIL_PASS || "xxsuwtbaqdsmrnvb"
        }
      });
      
      // Test connection
      console.log('🔗 Testing connection...');
      await transporter.verify();
      console.log('✅ Connection successful');
      
      // Send test email
      const testEmail = {
        from: `"${process.env.SENDER_NAME || 'Belloo Jobs Portal'}" <${process.env.SENDER_EMAIL || process.env.GMAIL_USER}>`,
        to: process.env.JOBS_EMAIL || process.env.GMAIL_USER,
        subject: '🧪 Test Email from Vercel',
        html: `
          <h2>🎉 Email Test Successful!</h2>
          <p>This is a test email sent from your Vercel deployment.</p>
          <p><strong>Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV}</p>
          <p><strong>Vercel:</strong> ${process.env.VERCEL === '1' ? 'Yes' : 'No'}</p>
        `
      };
      
      console.log('📨 Sending test email...');
      const result = await transporter.sendMail(testEmail);
      console.log('✅ Email sent successfully:', result.messageId);
      
      return res.status(200).json({
        success: true,
        message: 'Test email sent successfully',
        messageId: result.messageId,
        to: testEmail.to
      });
      
    } catch (error) {
      console.error('❌ Email test failed:', error);
      return res.status(500).json({
        success: false,
        error: error.message,
        details: error.code || 'Unknown error'
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed. Use GET to check config, POST to test email.' });
}

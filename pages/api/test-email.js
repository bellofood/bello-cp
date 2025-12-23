// Test email functionality for Vercel deployment debugging
export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      console.log('🔍 Testing email configuration...');
      
      // Check environment variables
      console.log('📋 Environment Variables Check:');
      console.log('GMAIL_USER:', process.env.GMAIL_USER ? '✅ Set' : '❌ Not set');
      console.log('GMAIL_PASS:', process.env.GMAIL_PASS ? '✅ Set' : '❌ Not set');
      console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL || 'Not set');
      console.log('JOBS_EMAIL:', process.env.JOBS_EMAIL || 'Not set');
      
      // Test email import
      let emailModule;
      try {
        emailModule = await import('../../lib/email.js');
        console.log('📧 Email module imported successfully');
      } catch (importError) {
        console.error('❌ Email module import failed:', importError);
        return res.status(500).json({
          success: false,
          error: 'Email module import failed',
          details: importError.message
        });
      }
      
      // Test email sending
      const testData = {
        name: 'Test User',
        email: 'test@example.com',
        position: 'Test Position',
        phone: '123-456-7890',
        title: 'Test Title',
        company: 'Test Company'
      };
      
      console.log('📨 Attempting to send test email...');
      const emailResult = await emailModule.sendJobApplicationNotification(testData, null);
      console.log('✅ Email result:', emailResult);
      
      return res.status(200).json({
        success: true,
        message: 'Email test completed',
        environmentVariables: {
          gmail_user: !!process.env.GMAIL_USER,
          gmail_pass: !!process.env.GMAIL_PASS,
          sender_email: process.env.SENDER_EMAIL,
          jobs_email: process.env.JOBS_EMAIL
        },
        emailResult: emailResult
      });
      
    } catch (error) {
      console.error('❌ Email test failed:', error);
      return res.status(500).json({
        success: false,
        error: 'Email test failed',
        details: error.message,
        stack: error.stack
      });
    }
  }
  
  return res.status(405).json({ error: 'Method not allowed' });
}

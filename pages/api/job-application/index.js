import { supabaseAdmin } from '../../../lib/supabase';
import { verifyAuth } from '../../../lib/auth';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // GET - Fetch all job applications (requires authentication)
  if (req.method === 'GET') {
    try {
      // Verify authentication
      const { authenticated } = await verifyAuth(req);

      if (!authenticated) {
        return res.status(401).json({ 
          success: false, 
          error: 'Not authenticated' 
        });
      }

      // Fetch all job applications, ordered by newest first
      const { data, error } = await supabaseAdmin
        .from('job_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching job applications:', error);
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to fetch job applications' 
        });
      }

      return res.status(200).json({
        success: true,
        data: data || [],
      });
    } catch (error) {
      console.error('Job applications fetch error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  // POST - Create a new job application (public endpoint)
  if (req.method === 'POST') {
    try {
      const form = formidable({
        maxFileSize: 5 * 1024 * 1024, // 5MB
        keepExtensions: true,
      });

      const [fields, files] = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve([fields, files]);
        });
      });

      // Extract field values (formidable returns arrays)
      const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
      const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
      const position = Array.isArray(fields.position) ? fields.position[0] : fields.position;
      const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
      const phone = Array.isArray(fields.phone) ? fields.phone[0] : fields.phone;
      const company = Array.isArray(fields.company) ? fields.company[0] : fields.company;
      const cv_link = Array.isArray(fields.cv_link) ? fields.cv_link[0] : fields.cv_link;

      // Validate required fields
      if (!name || !position || !email || !phone) {
        return res.status(400).json({ 
          success: false, 
          error: 'Name, position, email, and phone are required' 
        });
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid email format' 
        });
      }

      let cvFilePath = null;
      let cvFileName = null;
      let cvFileSize = null;

      // Handle CV file upload
      const cvFile = files.cv_file ? (Array.isArray(files.cv_file) ? files.cv_file[0] : files.cv_file) : null;
      
      if (cvFile && cvFile.size > 0) {
        const fileName = `${Date.now()}-${cvFile.originalFilename || cvFile.newFilename}`;
        const fileBuffer = fs.readFileSync(cvFile.filepath);

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabaseAdmin
          .storage
          .from('cvs')
          .upload(fileName, fileBuffer, {
            contentType: cvFile.mimetype,
            upsert: false,
          });

        if (uploadError) {
          console.error('Error uploading CV to Supabase:', uploadError);
          return res.status(500).json({ 
            success: false, 
            error: 'Failed to upload CV file' 
          });
        }

        cvFilePath = uploadData.path;
        cvFileName = cvFile.originalFilename || cvFile.newFilename;
        cvFileSize = cvFile.size;

        // Clean up temp file
        fs.unlinkSync(cvFile.filepath);
      }

      // Insert job application
      const { data, error } = await supabaseAdmin
        .from('job_applications')
        .insert([
          {
            name: name.trim(),
            title: title ? title.trim() : null,
            position: position.trim(),
            email: email.trim().toLowerCase(),
            phone: phone.trim(),
            company: company ? company.trim() : null,
            cv_file_path: cvFilePath,
            cv_file_name: cvFileName,
            cv_file_size: cvFileSize,
            cv_link: cv_link ? cv_link.trim() : null,
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error creating job application:', error);
        
        // Clean up uploaded file if database insert fails
        if (cvFilePath) {
          await supabaseAdmin.storage.from('cvs').remove([cvFilePath]);
        }
        
        return res.status(500).json({ 
          success: false, 
          error: 'Failed to submit job application' 
        });
      }

      return res.status(201).json({
        success: true,
        message: 'Job application submitted successfully',
        data,
      });
    } catch (error) {
      console.error('Job application submission error:', error);
      return res.status(500).json({ 
        success: false, 
        error: 'Internal server error' 
      });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}


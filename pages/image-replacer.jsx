import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ImageReplacer() {
  const [selectedImage, setSelectedImage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState('');
  const router = useRouter();

  const websiteImages = [
    { 
      id: 'skill-4',
      name: 'Skills Section - Left Image',
      path: '/assets/images/skill/skill-4.png',
      currentPath: '/assets/images/skill/skill-4.png',
      usage: 'Homepage - Skills section background (left)'
    },
    { 
      id: 'skill-5',
      name: 'Skills Section - Right Image',
      path: '/assets/images/skill/skill-5.png',
      currentPath: '/assets/images/skill/skill-5.png',
      usage: 'Homepage - Skills section background (right)'
    },
    { 
      id: 'hero-1',
      name: 'Hero Slider Image 1',
      path: '/assets/images/hero/hero_two-slider-1.jpg',
      currentPath: '/assets/images/hero/hero_two-slider-1.jpg',
      usage: 'Homepage - Hero section slider'
    },
    { 
      id: 'hero-2',
      name: 'Hero Slider Image 2',
      path: '/assets/images/hero/hero_two-slider-2.jpg',
      currentPath: '/assets/images/hero/hero_two-slider-2.jpg',
      usage: 'Homepage - Hero section slider'
    },
    { 
      id: 'hero-3',
      name: 'Hero Slider Image 3',
      path: '/assets/images/hero/hero_two-slider-3.jpg',
      currentPath: '/assets/images/hero/hero_two-slider-3.jpg',
      usage: 'Homepage - Hero section slider'
    }
  ];

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReplace = async (e) => {
    e.preventDefault();
    
    if (!selectedImage) {
      alert('Please select which image to replace');
      return;
    }

    const fileInput = document.getElementById('new-image');
    const file = fileInput?.files[0];
    
    if (!file) {
      alert('Please select a file to upload');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('targetImage', selectedImage);

      const response = await fetch('/api/replace-website-image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      alert('✅ Image replaced successfully!\n\n' + 
            'IMPORTANT: You must restart the dev server:\n' +
            '1. Press Ctrl+C in terminal\n' +
            '2. Run: npm run dev\n' +
            '3. Open website in incognito window\n\n' +
            'Then you will see the new image!');
      
      setPreview('');
      setSelectedImage('');
      fileInput.value = '';
      
    } catch (error) {
      console.error('Replace error:', error);
      alert(`Failed to replace image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Image Replacer - Simple Tool</title>
        <link rel="stylesheet" href="/assets/vendor/bootstrap/css/bootstrap.min.css" />
        <link rel="stylesheet" href="/assets/fonts/fontawesome/css/all.min.css" />
        <style>{`
          .replacer-container {
            max-width: 800px;
            margin: 50px auto;
            padding: 30px;
            background: #fff;
            border-radius: 12px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          }
          .replacer-header {
            text-align: center;
            margin-bottom: 40px;
          }
          .replacer-header h1 {
            color: #4D602C;
            margin-bottom: 10px;
          }
          .replacer-header p {
            color: #666;
            font-size: 16px;
          }
          .image-select {
            margin-bottom: 30px;
          }
          .image-option {
            padding: 20px;
            border: 2px solid #e0e0e0;
            border-radius: 8px;
            margin-bottom: 15px;
            cursor: pointer;
            transition: all 0.3s;
          }
          .image-option:hover {
            border-color: #4D602C;
            background: #f9f9f9;
          }
          .image-option.selected {
            border-color: #4D602C;
            background: #f0f5e9;
          }
          .image-option input[type="radio"] {
            margin-right: 15px;
            transform: scale(1.3);
          }
          .image-option-content {
            display: flex;
            align-items: center;
          }
          .image-option-preview {
            width: 100px;
            height: 80px;
            object-fit: cover;
            border-radius: 8px;
            margin-right: 20px;
          }
          .image-option-info h4 {
            margin: 0 0 5px 0;
            color: #333;
          }
          .image-option-info p {
            margin: 0;
            color: #666;
            font-size: 14px;
          }
          .upload-section {
            margin: 30px 0;
            padding: 30px;
            border: 2px dashed #4D602C;
            border-radius: 12px;
            text-align: center;
            background: #f9fdf5;
          }
          .preview-image {
            max-width: 100%;
            max-height: 400px;
            margin: 20px 0;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .btn-replace {
            background: linear-gradient(135deg, #4D602C 0%, #3a4721 100%);
            color: white;
            padding: 15px 40px;
            border: none;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
          }
          .btn-replace:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(77, 96, 44, 0.4);
          }
          .btn-replace:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .btn-back {
            background: #6c757d;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 8px;
            margin-bottom: 20px;
            cursor: pointer;
          }
          .btn-back:hover {
            background: #5a6268;
          }
        `}</style>
      </Head>

      <div className="replacer-container">
        <button className="btn-back" onClick={() => router.push('/admin')}>
          <i className="fas fa-arrow-left"></i> Back to Admin
        </button>

        <div className="replacer-header">
          <h1><i className="fas fa-exchange-alt"></i> Simple Image Replacer</h1>
          <p>Select an image and upload a new one to replace it</p>
        </div>

        <form onSubmit={handleReplace}>
          <div className="image-select">
            <h3>Step 1: Select Which Image to Replace</h3>
            {websiteImages.map((img) => (
              <label 
                key={img.id} 
                className={`image-option ${selectedImage === img.id ? 'selected' : ''}`}
              >
                <div className="image-option-content">
                  <input
                    type="radio"
                    name="targetImage"
                    value={img.id}
                    checked={selectedImage === img.id}
                    onChange={(e) => setSelectedImage(e.target.value)}
                  />
                  <img 
                    src={img.currentPath} 
                    alt={img.name}
                    className="image-option-preview"
                  />
                  <div className="image-option-info">
                    <h4>{img.name}</h4>
                    <p>{img.usage}</p>
                    <small style={{color: '#999'}}>{img.path}</small>
                  </div>
                </div>
              </label>
            ))}
          </div>

          <div className="upload-section">
            <h3>Step 2: Upload New Image</h3>
            <input
              type="file"
              id="new-image"
              accept="image/*"
              onChange={handleFileSelect}
              style={{ marginTop: '20px' }}
            />
            {preview && (
              <div>
                <p style={{marginTop: '20px', fontWeight: 'bold'}}>Preview:</p>
                <img src={preview} alt="Preview" className="preview-image" />
              </div>
            )}
          </div>

          <div style={{textAlign: 'center', marginTop: '30px'}}>
            <button 
              type="submit" 
              className="btn-replace"
              disabled={!selectedImage || !preview || uploading}
            >
              {uploading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Replacing...
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i> Replace Image
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}


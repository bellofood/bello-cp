import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    // Check authentication
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const localesPath = path.join(process.cwd(), 'public', 'locales');
    const languages = ['en', 'ar', 'ru', 'eg'];

    if (req.method === 'GET') {
      // Get all translations
      const { language } = req.query;

      if (language && languages.includes(language)) {
        // Get specific language
        const filePath = path.join(localesPath, language, 'common.json');
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const translations = JSON.parse(fileContent);

        return res.status(200).json({
          success: true,
          language,
          translations
        });
      } else {
        // Get all languages
        const allTranslations = {};
        
        for (const lang of languages) {
          const filePath = path.join(localesPath, lang, 'common.json');
          if (fs.existsSync(filePath)) {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            allTranslations[lang] = JSON.parse(fileContent);
          }
        }

        return res.status(200).json({
          success: true,
          languages,
          translations: allTranslations
        });
      }
    } else if (req.method === 'POST') {
      // Update translations
      const { language, translations, path: keyPath, value } = req.body;

      if (!language || !languages.includes(language)) {
        return res.status(400).json({ success: false, error: 'Invalid language' });
      }

      const filePath = path.join(localesPath, language, 'common.json');
      
      // Read current translations
      const fileContent = fs.readFileSync(filePath, 'utf8');
      let currentTranslations = JSON.parse(fileContent);

      if (keyPath && value !== undefined) {
        // Update specific key
        const keys = keyPath.split('.');
        let obj = currentTranslations;
        
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) {
            obj[keys[i]] = {};
          }
          obj = obj[keys[i]];
        }
        
        obj[keys[keys.length - 1]] = value;
      } else if (translations) {
        // Replace entire translation object
        currentTranslations = translations;
      } else {
        return res.status(400).json({ success: false, error: 'No translation data provided' });
      }

      // Create backup
      const backupPath = path.join(localesPath, language, `common.backup.${Date.now()}.json`);
      fs.writeFileSync(backupPath, fileContent);

      // Write updated translations
      fs.writeFileSync(filePath, JSON.stringify(currentTranslations, null, 2), 'utf8');

      return res.status(200).json({
        success: true,
        message: 'Translations updated successfully',
        language,
        backupCreated: backupPath
      });
    } else if (req.method === 'PUT') {
      // Bulk update multiple languages at once
      const { updates } = req.body; // { en: {...}, ar: {...}, ru: {...} }

      if (!updates || typeof updates !== 'object') {
        return res.status(400).json({ success: false, error: 'Invalid updates format' });
      }

      const results = [];

      for (const [lang, translationData] of Object.entries(updates)) {
        if (!languages.includes(lang)) {
          results.push({ language: lang, success: false, error: 'Invalid language' });
          continue;
        }

        const filePath = path.join(localesPath, lang, 'common.json');
        
        try {
          // Create backup
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const backupPath = path.join(localesPath, lang, `common.backup.${Date.now()}.json`);
          fs.writeFileSync(backupPath, fileContent);

          // Write new translations
          fs.writeFileSync(filePath, JSON.stringify(translationData, null, 2), 'utf8');
          
          results.push({ language: lang, success: true, backupCreated: backupPath });
        } catch (error) {
          results.push({ language: lang, success: false, error: error.message });
        }
      }

      return res.status(200).json({
        success: true,
        message: 'Bulk update completed',
        results
      });
    } else {
      return res.status(405).json({ success: false, error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Translation API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}


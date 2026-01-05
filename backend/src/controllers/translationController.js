import { translateMenuItems } from '../services/geminiTranslationService.js';
import MenuItem from '../models/MenuItem.js';

export const translateMenu = async (req, res) => {
  try {
    const { lang = 'en' } = req.query;
    
    console.log(`🌐 Translation request: ${lang}`);
    
    const menuItems = await MenuItem.find()
      .populate({
        path: 'ingredients.ingredientId',
        select: 'name stock unit threshold'
      });
    
    let data;
    if (lang === 'en') {
      data = menuItems.map(item => ({
        ...item.toObject(),
        language: 'en',
        translated: false
      }));
    } else {
      data = await translateMenuItems(menuItems, lang);
    }
    
    // Count translated vs untranslated
    const translatedCount = data.filter(item => item.translated).length;
    const totalCount = data.length;
    
    res.json({
      success: true,
      data,
      language: lang,
      translated: lang !== 'en',
      stats: {
        translated: translatedCount,
        total: totalCount,
        percent: Math.round((translatedCount / totalCount) * 100)
      },
      note: lang !== 'en' && translatedCount < totalCount 
        ? `Free tier limit: Only ${translatedCount} items translated. Rest remain in English.`
        : null
    });
    
  } catch (error) {
    console.error('Translation error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      note: "Check console for detailed logs"
    });
  }
};


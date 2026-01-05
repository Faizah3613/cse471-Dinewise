
export const translateMenuItems = async (menuItems, targetLanguage) => {
    if (targetLanguage === 'en') return menuItems;
    
    const translatedItems = [];
    
    console.log(`🌐 Using EXTERNAL MyMemory API for ${targetLanguage}`);
    
    // Translate ALL items
    for (const [index, item] of menuItems.entries()) {
      try {
        console.log(`🔄 [${index + 1}/${menuItems.length}] Translating via EXTERNAL API: ${item.name}`);
        
        // 1. EXTERNAL API CALL for NAME
        const nameUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(item.name)}&langpair=en|${targetLanguage}`;
        const nameResponse = await fetch(nameUrl);
        const nameData = await nameResponse.json();
        
        // Get translated name or keep original if API fails
        const translatedName = nameData.responseData?.translatedText || item.name;
        
        // 2. EXTERNAL API CALL for DESCRIPTION
        let translatedDesc = item.description || '';
        if (item.description) {
          const descUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(item.description)}&langpair=en|${targetLanguage}`;
          const descResponse = await fetch(descUrl);
          const descData = await descResponse.json();
          translatedDesc = descData.responseData?.translatedText || item.description;
        }
        
        // 3. Add to results
        translatedItems.push({
          ...(item.toObject ? item.toObject() : item),
          name: translatedName,
          description: translatedDesc,
          language: targetLanguage,
          translated: true,
          source: 'MyMemory External API'
        });
        
        console.log(`✅ ${item.name} → ${translatedName} (via EXTERNAL API)`);
        
        // Wait 0.5 seconds between calls to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.error(`❌ EXTERNAL API failed: ${error.message}`);
        translatedItems.push({
          ...(item.toObject ? item.toObject() : item),
          language: targetLanguage,
          translated: false,
          error: "External translation API unavailable"
        });
      }
    }
    
    const translatedCount = translatedItems.filter(i => i.translated).length;
    console.log(`📊 EXTERNAL API Result: ${translatedCount}/${menuItems.length} items translated`);
    
    return translatedItems;
  };
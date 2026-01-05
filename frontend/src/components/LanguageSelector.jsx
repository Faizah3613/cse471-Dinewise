// components/LanguageSelector.jsx
import React from 'react';

const LanguageSelector = ({ currentLang, onChange }) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'ar', name: 'العربية' },
    { code: 'ja', name: '日本語' }
  ];

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Language:
      </label>
      <div className="flex flex-wrap gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onChange(lang.code)}
            className={`px-4 py-2 rounded-lg transition ${currentLang === lang.code
                ? 'bg-rose-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
              }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
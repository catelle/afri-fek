'use client';

import { useState } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const [selectedText, setSelectedText] = useState('');

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      setSelectedText(selection.toString());
    }
  };

  const applyFormat = (format: 'orange' | 'blue' | 'bold') => {
    if (!selectedText) return;
    
    let formattedText = '';
    switch (format) {
      case 'orange':
        formattedText = `<span class="text-amber-600">${selectedText}</span>`;
        break;
      case 'blue':
        formattedText = `<span class="text-blue-600">${selectedText}</span>`;
        break;
      case 'bold':
        formattedText = `<strong>${selectedText}</strong>`;
        break;
    }
    
    const newValue = value.replace(selectedText, formattedText);
    onChange(newValue);
    setSelectedText('');
  };

  return (
    <div className="border border-orange-200 rounded-lg">
      <div className="flex items-center gap-2 p-2 border-b border-orange-100 bg-gray-50">
        <button
          type="button"
          onClick={() => applyFormat('orange')}
          disabled={!selectedText}
          className="px-3 py-1 bg-amber-100 text-amber-700 rounded text-xs hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🟠 Orange
        </button>
        <button
          type="button"
          onClick={() => applyFormat('blue')}
          disabled={!selectedText}
          className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🔵 Bleu
        </button>
        <button
          type="button"
          onClick={() => applyFormat('bold')}
          disabled={!selectedText}
          className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <strong>B</strong> Gras
        </button>
        {selectedText && (
          <span className="text-xs text-gray-500 ml-2">
            Sélectionné: "{selectedText}"
          </span>
        )}
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onMouseUp={handleTextSelection}
        onKeyUp={handleTextSelection}
        rows={3}
        className="w-full px-3 py-2 focus:ring-2 focus:ring-orange-500 focus:outline-none border-0 resize-none"
        placeholder={placeholder || "Sélectionnez du texte et utilisez les boutons ci-dessus pour le formater"}
      />
    </div>
  );
}
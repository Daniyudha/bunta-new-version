'use client';

import React, { useState } from 'react';

interface SimpleTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SimpleTextEditor: React.FC<SimpleTextEditorProps> = ({
  value,
  onChange,
  placeholder = 'Write something amazing...',
  className = '',
}) => {
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);

  const handleFormat = (format: string) => {
    let newValue = value;
    
    switch (format) {
      case 'bold':
        if (isBold) {
          newValue = value.replace(/<\/?strong>/g, '');
        } else {
          newValue = `<strong>${value}</strong>`;
        }
        setIsBold(!isBold);
        break;
      
      case 'italic':
        if (isItalic) {
          newValue = value.replace(/<\/?em>/g, '');
        } else {
          newValue = `<em>${value}</em>`;
        }
        setIsItalic(!isItalic);
        break;
      
      case 'underline':
        if (isUnderline) {
          newValue = value.replace(/<\/?u>/g, '');
        } else {
          newValue = `<u>${value}</u>`;
        }
        setIsUnderline(!isUnderline);
        break;
      
      default:
        break;
    }
    
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`border border-gray-300 rounded-md ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center space-x-2 p-2 border-b border-gray-300 bg-gray-50 rounded-t-md">
        <button
          type="button"
          onClick={() => handleFormat('bold')}
          className={`p-2 rounded hover:bg-gray-200 ${
            isBold ? 'bg-gray-300' : ''
          }`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('italic')}
          className={`p-2 rounded hover:bg-gray-200 ${
            isItalic ? 'bg-gray-300' : ''
          }`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          onClick={() => handleFormat('underline')}
          className={`p-2 rounded hover:bg-gray-200 ${
            isUnderline ? 'bg-gray-300' : ''
          }`}
          title="Underline"
        >
          <u>U</u>
        </button>
      </div>

      {/* Textarea */}
      <textarea
        value={value.replace(/<\/?[^>]+(>|$)/g, '')} // Strip HTML tags for editing
        onChange={handleInputChange}
        placeholder={placeholder}
        className="w-full h-64 p-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-b-md"
        style={{ minHeight: '200px' }}
      />

      {/* Preview (optional) */}
      {value && (
        <div className="p-4 border-t border-gray-300 bg-gray-50">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: value }}
          />
        </div>
      )}
    </div>
  );
};

export default SimpleTextEditor;
'use client';

import React from 'react';
import dynamic from 'next/dynamic';

interface CKEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Create a simple loading component
const CKEditorLoading = () => (
  <div className="h-64 border border-gray-300 rounded-md p-4 bg-gray-50 animate-pulse">
    Memuat editor...
  </div>
);

// Dynamically import the actual CKEditor component with no SSR
const CustomCKEditor = dynamic(() => {
  return import('./CKEditorClient').then(mod => mod.default) as Promise<React.ComponentType<CKEditorProps>>;
}, {
  ssr: false,
  loading: () => <CKEditorLoading />
});

export default CustomCKEditor;
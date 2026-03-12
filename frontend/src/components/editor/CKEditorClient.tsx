// src/components/editor/CKEditorClient.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

// Pastikan UploadLoader, UploadAdapterReturn, CKEditorEditorInstance, FileRepositoryPlugin
// secara global tersedia atau diimpor jika diperlukan.

class MyUploadAdapter {
    private loader: UploadLoader;
    private apiUrl: string;

    constructor(loader: UploadLoader) {
        this.loader = loader;
        this.apiUrl = '/api/admin/media';
    }

    upload(): Promise<{ default: string }> {
        return this.loader.file
            .then((file: File) => new Promise((resolve, reject) => {
                const formData = new FormData();
                formData.append('file', file);

                fetch(this.apiUrl, {
                    method: 'POST',
                    body: formData,
                    credentials: 'include',
                })
                .then(res => {
                    console.log('CKEditor upload response status:', res.status, res.statusText);
                    if (!res.ok) {
                        return res.json().then(data => {
                            console.error('CKEditor upload failed with server response:', data);
                            reject(data.error?.message || data.message || `Server error: ${res.status} ${res.statusText}`);
                        }).catch(() => {
                            reject(`Server error: ${res.status} ${res.statusText}`);
                        });
                    }
                    return res.json();
                })
                .then(data => {
                    if (data && data.url) {
                        resolve({ default: data.url });
                    } else {
                        reject('Invalid response from server: URL not found.');
                    }
                })
                .catch(error => {
                    console.error('CKEditor upload network error:', error);
                    reject(error.message || 'Network error during upload. Check console for details.');
                });
            }));
    }
    abort() {
        console.log('Upload aborted.');
    }
}

function MyCustomUploadAdapterPlugin(editor: CKEditorEditorInstance) {
  const fileRepositoryPlugin = editor.plugins.get('FileRepository') as FileRepositoryPlugin;
  fileRepositoryPlugin.createUploadAdapter = (loader: UploadLoader) => {
    return new MyUploadAdapter(loader);
  };
}

interface CKEditorClientProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const CKEditorClient: React.FC<CKEditorClientProps> = ({
  value,
  onChange,
  placeholder = 'Tulis sesuatu yang menarik...',
  className = '',
}) => {
  const editorRef = useRef<{
    // Gunakan any untuk menampung seluruh modul secara dinamis
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    CKEditorReactModule: any; 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ClassicEditorModule: any;
  } | null>(null);
  const [isEditorLoaded, setIsEditorLoaded] = useState(false);

  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // @ts-expect-error Setting global license key for CKEditor in development
    window.CKEDITOR_LICENSE_KEY = 'GPL';
  }

  useEffect(() => {
    import('@ckeditor/ckeditor5-react')
      .then(ckeditorModule => {
        import('@ckeditor/ckeditor5-build-classic')
          .then(classicEditorModule => {
            editorRef.current = {
              CKEditorReactModule: ckeditorModule, // Simpan seluruh objek modul
              ClassicEditorModule: classicEditorModule, // Simpan seluruh objek modul
            };
            setIsEditorLoaded(true);
          })
          .catch(error => {
            console.error("Failed to load ClassicEditor", error);
          });
      })
      .catch(error => {
        console.error("Failed to load CKEditor React component", error);
      });
    
    return () => {
      setIsEditorLoaded(false);
      editorRef.current = null;
    };
  }, []);

  if (!isEditorLoaded || !editorRef.current) {
    return (
      <div className={`${className} border rounded p-4 bg-gray-50 min-h-[300px] flex items-center justify-center`}>
        <div className="text-gray-500">Loading editor...</div>
      </div>
    );
  }

  // Ambil komponen CKEditor dan ClassicEditor dari modul yang disimpan
  // Gunakan optional chaining dan cast ke any jika perlu untuk mengakses properti
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CKEditorComponent = (editorRef.current.CKEditorReactModule?.CKEditor || editorRef.current.CKEditorReactModule?.default?.CKEditor) as React.ComponentType<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ClassicEditorComponent = (editorRef.current.ClassicEditorModule?.default || editorRef.current.ClassicEditorModule) as any;

  if (!CKEditorComponent || !ClassicEditorComponent) {
    return (
        <div className={`${className} border rounded p-4 bg-gray-50 min-h-[300px] flex items-center justify-center`}>
            <div className="text-red-500">Error: Editor components not found after loading.</div>
        </div>
    );
  }

  const editorConfiguration = {
    placeholder,
    extraPlugins: [MyCustomUploadAdapterPlugin],
    toolbar: {
      items: [
        'heading',
        '|',
        'bold',
        'italic',
        'link',
        'bulletedList',
        'numberedList',
        '|',
        'outdent',
        'indent',
        '|',
        'imageUpload',
        'blockQuote',
        'insertTable',
        'mediaEmbed',
        'undo',
        'redo',
      ],
    },
    // Remove text limits for articles
    wordCount: {
      onUpdate: (stats: { words: number; characters: number }) => {
        console.log('Word count:', stats.words, 'Character count:', stats.characters);
      },
    },
    // Disable any content filtering that might limit text
    allowedContent: true,
    // Increase maximum content size
    htmlSupport: {
      allow: [
        {
          name: /.*/,
          attributes: true,
          classes: true,
          styles: true
        }
      ]
    }
  };

  return (
    <div className={className}>
      <CKEditorComponent
        editor={ClassicEditorComponent}
        data={value}
        config={editorConfiguration}
        onReady={(editor: CKEditorEditorInstance) => {
          console.log('Editor is ready to use!', editor);
        }}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onChange={(event: unknown, editor: any) => {
          const data = editor.getData();
          onChange(data);
        }}
      />
    </div>
  );
};

export default CKEditorClient;
// src/types/ckeditor.d.ts

declare module "@ckeditor/ckeditor5-react" {
  interface CKEditorProps {
    onReady?: (editor: CKEditorEditorInstance) => void;
    // Gunakan any di sini untuk lebih fleksibel, dengan eslint-disable-next-line
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onChange?: (event: unknown, editor: CKEditorEditorInstance | any) => void;
  }
}

interface CKEditorEditorInstance {
  getData: () => string;
  setData?: (data: string) => void;
  plugins: {
    get: (pluginName: string) => unknown; // Use unknown instead of any for type safety
  };
  model?: unknown;
  editing?: unknown;
  // Tambahkan properti lain yang mungkin ada di instance CKEditor dari d.ts yang sudah ada
}

// Tipe untuk loader upload
interface UploadLoader {
    file: Promise<File>;
}

// Tipe untuk kembalian adapter upload
interface UploadAdapterReturn {
    upload: () => Promise<{ default: string }>;
    abort?: () => void; // Tambahkan abort jika diimplementasikan
}

// Tipe untuk FileRepositoryPlugin yang memiliki createUploadAdapter
interface FileRepositoryPlugin {
    createUploadAdapter: (loader: UploadLoader) => UploadAdapterReturn;
}
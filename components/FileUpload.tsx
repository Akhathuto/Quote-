
import React from 'react';
import { UploadCloud, File as FileIcon, X } from 'lucide-react';

interface FileUploadProps {
  id: string;
  label: string;
  file: File | undefined;
  onFileChange: (file: File | undefined) => void;
  accept?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, label, file, onFileChange, accept }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileChange(e.target.files[0]);
    } else {
      onFileChange(undefined);
    }
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.preventDefault();
    onFileChange(undefined);
    // Reset the input value
    const input = document.getElementById(id) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">
        {label}
      </label>
      {!file ? (
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-gray-500" />
            <div className="flex text-sm text-gray-400">
              <label
                htmlFor={id}
                className="relative cursor-pointer bg-brand-dark rounded-md font-medium text-brand-primary hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-brand-dark focus-within:ring-brand-primary"
              >
                <span>Upload a file</span>
                <input id={id} name={id} type="file" className="sr-only" onChange={handleFileChange} accept={accept} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500">PDF, DOCX, XLSX up to 10MB</p>
          </div>
        </div>
      ) : (
        <div className="mt-1 flex items-center justify-between p-3 border border-gray-600 rounded-md bg-brand-secondary">
          <div className="flex items-center space-x-3">
            <FileIcon className="h-6 w-6 text-gray-400" />
            <span className="text-sm text-gray-200 truncate">{file.name}</span>
          </div>
          <button onClick={handleRemoveFile} className="text-gray-400 hover:text-red-500">
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

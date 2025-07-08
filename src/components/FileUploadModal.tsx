import React, { useState } from 'react';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  uploadedFiles: string[];
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ 
  isOpen, 
  onClose, 
  onUpload, 
  uploadedFiles 
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = () => {
    if (selectedFiles.length > 0) {
      onUpload(selectedFiles);
      setSelectedFiles([]);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>上传文件</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="fileInput">选择文件</label>
            <input
              id="fileInput"
              type="file"
              multiple
              accept=".txt,.pdf,.doc,.docx,.md"
              onChange={handleFileSelect}
              className="form-input"
            />
            <p className="help-text">
              支持的文件类型：txt, pdf, doc, docx, md
            </p>
          </div>
          
          {selectedFiles.length > 0 && (
            <div className="form-group">
              <label>待上传文件</label>
              <ul className="file-list">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="file-item">
                    📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {uploadedFiles.length > 0 && (
            <div className="form-group">
              <label>已上传文件</label>
              <ul className="file-list">
                {uploadedFiles.map((fileName, index) => (
                  <li key={index} className="file-item uploaded">
                    ✅ {fileName}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>
            取消
          </button>
          <button 
            className="btn-primary" 
            onClick={handleUpload}
            disabled={selectedFiles.length === 0}
          >
            上传
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileUploadModal;
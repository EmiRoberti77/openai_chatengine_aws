import React, { useState } from 'react';
import { noAllowedFiles } from '../Share/Util';

interface FileUploadProps {
  onFileContentHandle: (content: string) => void;
  styleName: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFileContentHandle,
  styleName,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFile(file);
    }
  };

  const upload = () => {
    if (selectedFile) {
      if (noAllowedFiles.find((element) => element === selectedFile.type)) {
        console.error(selectedFile.type, 'file type not supported');
        return;
      }
      console.log('read file');
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const fileContent = event.target.result as string;
          console.info(fileContent);
          onFileContentHandle(fileContent);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  return (
    <div>
      <div>
        <input className={styleName} type="file" onChange={handleFileUpload} />
        <button className={styleName} onClick={upload}>
          +
        </button>
      </div>
    </div>
  );
};

export default FileUpload;

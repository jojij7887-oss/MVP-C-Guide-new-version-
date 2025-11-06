import React, { useState } from "react";
import { uploadImageToGoogleDrive } from "../utils/uploadService";

// Note: This appears to be an unused test component.
const FileUpload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    try {
      const folderKey = "College_Logo"; // Change this for each folder (College_Banner, Admin_Profile, etc.)

      const dummyId = "test-id";
      const dummyFieldName = "test-field";
      const uploadedUrl = await uploadImageToGoogleDrive(
        file,
        folderKey,
        dummyId,
        dummyFieldName
      );
      setMessage("✅ Uploaded and saved to Google Sheet successfully!");
    } catch (error) {
      setMessage("❌ Upload failed. Check console for details.");
      console.error(error);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-lg font-bold mb-2">Upload File to Google Drive</h2>
      <input type="file" onChange={handleFileChange} />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-3 py-1 rounded mt-3"
      >
        Upload
      </button>
      <p className="mt-2 text-sm">{message}</p>
    </div>
  );
};

export default FileUpload;
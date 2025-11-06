/**
 * Uploads a file to a Google Drive folder via a Google Apps Script endpoint,
 * then sends a second request to the same endpoint to save the returned URL
 * into a Google Sheet.
 *
 * @param file The file to upload.
 * @param folderKey A key or name for the destination folder on Google Drive.
 * @param id The unique identifier for the row to update in Google Sheets (e.g., student ID or college ID).
 * @param fieldName The name of the column/field to update with the file URL (e.g., 'cert10th', 'collegeLogoUrl').
 * @returns A promise that resolves with the URL of the uploaded file upon successful upload and sheet update.
 */

const scriptUrl = "https://script.google.com/macros/s/AKfycbySqJtx8Mc9rFu7GcOUVkZXbmCVvq0KLpjjE_Q3mEniHyAr-7dbIcDoxQWQhWQf2gFQIg/exec";

export async function uploadImageToGoogleDrive(
  file: File,
  folderKey: string,
  id: string,
  fieldName: string
): Promise<string> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        if (typeof reader.result !== 'string') {
          return reject(new Error('FileReader did not return a string.'));
        }
        const base64Image = reader.result.split(",")[1];

        // Step 1: Upload the file to Google Drive
        const uploadDetails = {
          folder: folderKey,
          file: base64Image,
          type: file.type || "application/octet-stream",
        };
        const uploadFormBody = Object.entries(uploadDetails)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
          .join("&");

        const uploadResponse = await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: uploadFormBody,
        });

        const uploadedUrl = await uploadResponse.text();
        if (!uploadResponse.ok) {
          throw new Error(`Upload failed: ${uploadedUrl}`);
        }
        console.log(`Upload → Drive: Successful for ${folderKey}:`, uploadedUrl);

        // Step 2: Auto-save the URL to Google Sheets
        await saveUrlToSheet(id, fieldName, uploadedUrl);
        
        // If both steps are successful, resolve the promise
        resolve(uploadedUrl);

      } catch (error) {
        console.error(`⚠️ Upload process error for ${folderKey}:`, error);
        reject(error as Error);
      }
    };

    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}


/**
 * Saves a file URL to a specific cell in Google Sheets.
 * @param id The unique identifier for the row.
 * @param fieldName The name of the column/field to update.
 * @param fileUrl The URL to save.
 */
export async function saveUrlToSheet(id: string, fieldName: string, fileUrl: string): Promise<void> {
  console.log(`... → Sheet: Attempting to save URL for field ${fieldName}.`);
  const updateDetails = {
    type: "fileUpdate",
    id,
    fieldName,
    fileUrl,
  };
  const updateFormBody = Object.entries(updateDetails)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");
  
  const response = await fetch(scriptUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: updateFormBody,
  });
  
  const updateResult = await response.text();
  if (!response.ok) {
     throw new Error(`Auto-save failed: ${updateResult}`);
  }
  console.log(`✅ Sheet update attempt successful: ${updateResult}`);
}

/**
 * Verifies if the correct URL is present in a specific Google Sheet cell.
 * @param id The unique identifier for the row.
 * @param fieldName The name of the column/field to check.
 * @param expectedUrl The URL that is expected to be in the cell.
 * @returns A promise that resolves to true if the URL matches, false otherwise.
 */
export async function verifyUrlInSheet(id: string, fieldName: string, expectedUrl: string): Promise<boolean> {
  const verifyDetails = {
    type: "verifyFile", // This new action must be handled by the Apps Script
    id: id,
    fieldName: fieldName,
  };

  const verifyFormBody = Object.entries(verifyDetails)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join("&");

  try {
    const response = await fetch(scriptUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verifyFormBody,
    });
    
    const actualUrl = await response.text();
    if (!response.ok) {
        console.error(`Verification request failed: ${actualUrl}`);
        return false;
    }
    
    // The Apps Script should be designed to return the raw URL string from the cell
    return actualUrl.trim() === expectedUrl.trim();

  } catch (error) {
    console.error('Verification network error:', error);
    return false;
  }
}
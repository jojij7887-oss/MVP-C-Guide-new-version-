/**
 * Uploads an image file to a Google Drive folder via a Google Apps Script endpoint.
 * This function reads the file as a Base64 string and sends it using
 * 'application/x-www-form-urlencoded' format, which is typically expected
 * by simple Apps Script web apps and matches the behavior of the original Dart implementation.
 *
 * @param file The image file to upload (e.g., from an <input type="file">).
 * @param folderKey A key or name for the destination folder on Google Drive.
 * @returns A promise that resolves with the URL of the uploaded file.
 */
export async function uploadImageToCGuide(file: File, folderKey: string): Promise<string> {
  const uploadUrl = "https://script.google.com/macros/s/AKfycbySqJtx8Mc9rFu7GcOUVkZXbmCVvq0KLpjjE_Q3mEniHyAr-7dbIcDoxQWQhWQf2gFQIg/exec";

  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('FileReader did not return a string.'));
      }

      // reader.result is a data URL like "data:image/jpeg;base64,..."
      const base64Image = reader.result.split(",")[1];
      
      const details: Record<string, string> = {
        'folder': folderKey,
        'file': base64Image,
        'type': file.type || 'image/jpeg',
      };

      // Construct the 'application/x-www-form-urlencoded' body.
      const formBody = Object.entries(details)
        .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
        .join('&');

      try {
        // The Apps Script must be configured to return correct CORS headers
        // for the browser to be able to read the response.
        const response = await fetch(uploadUrl, {
          method: "POST",
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: formBody,
        });

        const text = await response.text();
        if (response.ok) {
          console.log("✅ Uploaded successfully:", text);
          resolve(text);
        } else {
          console.error("❌ Upload failed:", text);
          reject(new Error(`Upload failed: ${response.status} ${text}`));
        }
      } catch (error) {
        console.error("⚠️ Network or other error during upload:", error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      console.error("FileReader error:", error);
      reject(error);
    };

    reader.readAsDataURL(file);
  });
}
/**
 * This module provides a debounced function to automatically save college profile data
 * to a Google Apps Script endpoint. It's designed to be called on every form input change,
 * automatically handling the API requests after a short delay.
 */

// The Google Apps Script web app URL endpoint.
const scriptUrl = "https://script.google.com/macros/s/AKfycbxncrRWulgR8fywRAL_q-uQbWfuAlm38Bcw6eXy-YXdXWTH2bn6uxXDyxkk-v5D5jum/exec";

/**
 * Interface representing the data structure for a college profile.
 * These fields will be sent to the backend upon change.
 */
export interface AutoSaveCollegeProfileData {
    collegeName: string;
    email: string;
    phone: string;
    address: string;
    website: string;
    affiliation: string;
    logoURL: string;
    description: string;
}

// Timeout ID for the debounce mechanism.
let timeoutId: number | null = null;
const DEBOUNCE_DELAY = 1500; // 1.5 seconds

/**
 * Sends college profile data to the Google Apps Script endpoint after a debounce delay.
 * This function should be called every time an input field in the college profile form changes.
 *
 * @param profileData The complete, updated college profile data from the form.
 */
export function autoSaveCollegeProfile(profileData: AutoSaveCollegeProfileData): void {
  // Clear the previous timeout if it exists to reset the debounce timer.
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  // Set a new timeout to trigger the save operation after the delay.
  timeoutId = window.setTimeout(async () => {
    try {
      const response = await fetch(scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: "autoSaveCollegeProfile",
          data: profileData,
        }),
      });

      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      // Attempt to parse the response, but log success even if it's not JSON,
      // as some simple Apps Script endpoints might not return a JSON body.
      try {
        const result = await response.json();
        console.log("✅ Auto-saved College Profile", result);
      } catch (jsonError) {
        console.log("✅ Auto-saved College Profile (Response not in JSON format)");
      }

    } catch (error) {
      console.warn("⚠️ Failed to auto-save college profile:", error);
    }
  }, DEBOUNCE_DELAY);
}

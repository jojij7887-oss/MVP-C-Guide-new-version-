/**
 * This file sends dummy college profile data to a specified Google Apps Script web app endpoint.
 * It is intended for testing or initial data seeding purposes.
 */

// The Google Apps Script web app URL endpoint.
const scriptUrl = "https://script.google.com/macros/s/AKfycbxncrRWulgR8fywRAL_q-uQbWfuAlm38Bcw6eXy-YXdXWTH2bn6uxXDyxkk-v5D5jum/exec";

// Dummy college profile data to be sent.
const dummyCollegeData = {
    collegeName: "Innovate University",
    location: "Tech City, Future State",
    bannerImageURL: "https://picsum.photos/seed/innovate-banner/1200/400",
    logoURL: "https://picsum.photos/seed/innovate-logo/200/200",
    description: "A forward-thinking institution dedicated to shaping the minds of tomorrow's leaders in technology and arts.",
    fullName: "Dr. Jane Smith (Admin)",
    email: "admin.janesmith@innovateuni.edu",
    phone: "1-800-INNOVATE",
    role: "COLLEGE_ADMIN"
};

/**
 * Sends the dummy college data to the Google Apps Script endpoint.
 * Logs the response or any errors to the console.
 */
export async function sendDummyCollegeProfileData(): Promise<void> {
  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // To be consistent with the existing sheetsApi.ts, we wrap the data.
      // The Apps Script likely expects a 'type' to route the data correctly.
      body: JSON.stringify({
        type: "collegeProfile",
        data: dummyCollegeData,
      }),
    });

    if (!response.ok) {
        // Handle non-2xx responses by attempting to read the error text.
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // Apps Script can return JSON, so we try to parse it.
    const result = await response.json();
    console.log("✅ College Data Response:", result);

  } catch (error) {
    console.error("❌ Failed to send college data:", error);
  }
}

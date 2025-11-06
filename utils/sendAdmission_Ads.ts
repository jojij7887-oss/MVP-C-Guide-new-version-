/**
 * This file sends dummy admission advertisement data to a specified Google Apps Script web app endpoint.
 * It is intended for testing or initial data seeding purposes.
 */

// The Google Apps Script web app URL endpoint.
const scriptUrl = "https://script.google.com/macros/s/AKfycbxncrRWulgR8fywRAL_q-uQbWfuAlm38Bcw6eXy-YXdXWTH2bn6uxXDyxkk-v5D5jum/exec";

// Dummy admission advertisement data to be sent.
const dummyAdmissionAdData = {
    collegeID: "INNOVATE-001",
    type: "Scholarship",
    title: "Early Bird Scholarship for Innovators",
    description: "Apply before the deadline to receive a 20% scholarship on your first year's tuition. Limited spots available for aspiring tech leaders.",
    mediaURL: "https://picsum.photos/seed/innovate-scholarship/800/400",
    targetLink: "https://innovateuni.edu/scholarships/early-bird",
    startDate: "2024-08-15",
    status: "Active"
};

/**
 * Sends the dummy admission ad data to the Google Apps Script endpoint.
 * Logs the response or any errors to the console.
 */
export async function sendDummyAdmissionAdData(): Promise<void> {
  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Apps Script web apps might expect a specific payload structure.
      // We will wrap the data with a 'type' property.
      body: JSON.stringify({
        type: "admissionAd",
        data: dummyAdmissionAdData,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Admission Ads Response:", result);

  } catch (error) {
    console.error("❌ Failed to send admission ads data:", error);
  }
}

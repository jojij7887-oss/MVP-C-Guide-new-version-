/**
 * This file sends dummy course data to a specified Google Apps Script web app endpoint.
 * It is intended for testing or initial data seeding purposes.
 */

// The Google Apps Script web app URL endpoint.
const scriptUrl = "https://script.google.com/macros/s/AKfycbxncrRWulgR8fywRAL_q-uQbWfuAlm38Bcw6eXy-YXdXWTH2bn6uxXDyxkk-v5D5jum/exec";

// Dummy course data to be sent.
const dummyCourseData = {
    collegeID: "INNOVATE-001",
    courseName: "Quantum Computing Fundamentals",
    duration: "4 Years",
    feesPerYear: "250000",
    totalSeats: 100,
    eligibilityCriteria: "10+2 with Physics, Chemistry, and Advanced Mathematics (PCAM) with a minimum of 75% aggregate.",
    description: "An advanced undergraduate program exploring the principles of quantum mechanics and their application in next-generation computing.",
    admissionOpenDate: "2024-09-01",
    admissionEndDate: "2025-02-28",
    isPremium: "Yes",
    isNew: "Yes"
};

/**
 * Sends the dummy course data to the Google Apps Script endpoint.
 * Logs the response or any errors to the console.
 */
export async function sendDummyCourseData(): Promise<void> {
  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // Apps Script web apps might expect a specific payload structure.
      // We will wrap the data with a 'type' property.
      body: JSON.stringify({
        type: "course",
        data: dummyCourseData,
      }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    console.log("✅ Course Data Response:", result);

  } catch (error) {
    console.error("❌ Failed to send course data:", error);
  }
}

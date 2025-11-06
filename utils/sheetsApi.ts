

/**
 * NOTE: This file is a TypeScript implementation of the provided `sheets_api.dart` file.
 * It provides functions to send application data to a Google Sheets backend via an Apps Script Web App.
 */

// 🌐 Your Apps Script Web App URL
const scriptUrl = "https://script.google.com/macros/s/AKfycbySqJtx8Mc9rFu7GcOUVkZXbmCVvq0KLpjjE_Q3mEniHyAr-7dbIcDoxQWQhWQf2gFQIg/exec";
// 🔗 Webhook URL for Make.com
const makeWebhookUrl = "https://hook.eu2.make.com/bn1oo8rgmvck2q59iicdtmmq2ujygpqe";


// 🔹 COMMON FUNCTION — Used by all data types except college profile
async function sendToSheet(type: string, data: Record<string, any>): Promise<void> {
  try {
    // Apps Script web apps often require a POST request with a specific payload format.
    // This implementation matches the structure from the provided Dart code.
    await fetch(scriptUrl, {
      method: 'POST',
      mode: 'no-cors', // Often required for simple Apps Script POST endpoints to avoid CORS issues. We won't be able to read the response, but the data will be sent.
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: type,
        data: data,
      }),
    });
    
    // With 'no-cors', we can't check response.ok or read the body.
    // We will assume success if the request doesn't throw an error.
    console.log(`✅ ${type} data sent successfully (assumed due to no-cors mode).`);

  } catch (e) {
    console.warn(`⚠️ Error sending ${type} data:`, e);
  }
}

/// 🧍 STUDENT DATA
export async function sendStudentData({
  fullName,
  email,
  phone,
  profilePhotoLink,
  studentClass,
  selectedCourse,
  certificate10Link,
  certificate12Link,
  applicationDate,
  status,
  photoURL,
  videoURL,
  role,
}: {
  fullName: string;
  email: string;
  phone: string;
  profilePhotoLink: string;
  studentClass: string;
  selectedCourse: string;
  certificate10Link: string;
  certificate12Link: string;
  applicationDate: string;
  status: string;
  photoURL: string;
  videoURL: string;
  role: string;
}) {
  await sendToSheet("student", {
    "fullName": fullName,
    "email": email,
    "phone": phone,
    "profilePhotoLink": profilePhotoLink,
    "class": studentClass,
    "selectedCourse": selectedCourse,
    "certificate10Link": certificate10Link,
    "certificate12Link": certificate12Link,
    "applicationDate": applicationDate,
    "status": status,
    "photoURL": photoURL,
    "videoURL": videoURL,
    "role": role,
  });
}

/// 👨‍💼 ADMIN DATA
export async function sendAdminData({
  name,
  email,
  phone,
  role,
}: {
  name: string;
  email: string;
  phone: string;
  role: string;
}) {
  await sendToSheet("admin", {
    "name": name,
    "email": email,
    "phone": phone,
    "role": role,
  });
}

/// 🏫 COLLEGE DATA (Now sends to Make.com Webhook)
export async function sendCollegeData({
  collegeID,
  collegeName,
  location,
  phone,
  upiId,
  bannerImageURL,
  logoURL,
  fullDescription,
  shortDescription,
  featuredListing,
  profileCompleteness,
  admissionOpenDate,
  admissionCloseDate,
}: {
  collegeID: string;
  collegeName: string;
  location: string;
  phone?: string;
  upiId?: string;
  bannerImageURL: string;
  logoURL: string;
  fullDescription: string;
  shortDescription: string;
  featuredListing: string;
  profileCompleteness: string;
  admissionOpenDate: string;
  admissionCloseDate: string;
}) {
  const data = {
    type: "college",
    collegeID,
    collegeName,
    location,
    phone,
    upi_id: upiId,
    bannerImageUrl: bannerImageURL,
    logoUrl: logoURL,
    fullDescription,
    shortDescription,
    featuredListing,
    profileCompleteness,
    Admission_Open_Date: admissionOpenDate,
    Admission_Close_Date: admissionCloseDate,
    timestamp: new Date().toISOString(),
  };

  try {
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("✅ College data sent successfully!");
    } else {
      const responseBody = await response.text();
      console.error(`❌ Failed to send college data: ${response.status} ${responseBody}`);
    }
  } catch (e) {
    console.warn(`⚠️ Error sending college data:`, e);
  }
}


/// 🎓 COURSE DATA (Now sends to Make.com Webhook)
export async function sendCourseData({
  collegeID,
  courseName,
  duration,
  feesPerYear,
  totalSeats,
  confirmedAdmissions,
  eligibilityCriteria,
  description,
  admissionOpenDate,
  admissionEndDate,
  isPremium,
  isNew,
}: {
  collegeID: string;
  courseName: string;
  duration: string;
  feesPerYear: string;
  totalSeats: string;
  confirmedAdmissions: string;
  eligibilityCriteria: string;
  description: string;
  admissionOpenDate: string;
  admissionEndDate: string;
  isPremium: string;
  isNew: string;
}) {
  const data = {
    type: "course",
    collegeID,
    courseName,
    duration,
    feesPerYear,
    totalSeats,
    confirmedAdmissions,
    eligibilityCriteria,
    description,
    admissionOpenDate,
    admissionEndDate,
    isPremium,
    isNew,
  };

  try {
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("✅ Course data sent successfully!");
    } else {
      const responseBody = await response.text();
      console.error(`❌ Failed to send course data: ${response.status} ${responseBody}`);
    }
  } catch (e) {
    console.warn(`⚠️ Error sending course data:`, e);
  }
}

/// 📢 ADMISSION / AD DATA (Now sends to Make.com Webhook)
export async function sendAdmissionAdData({
  collegeID,
  type,
  title,
  description,
  mediaURL,
  targetLink,
  startDate,
  status,
}: {
  collegeID: string;
  type: string;
  title: string;
  description: string;
  mediaURL: string;
  targetLink: string;
  startDate: string;
  status: string;
}) {
  const data = {
    type: "admission",
    collegeID,
    adType: type, // Renamed from 'type' to prevent conflict with the main object type
    title,
    description,
    mediaURL,
    targetLink,
    startDate,
    status,
  };

  try {
    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log("✅ Admission Ads data sent successfully!");
    } else {
      const responseBody = await response.text();
      console.error(`❌ Failed to send admission ads data: ${response.status} ${responseBody}`);
    }
  } catch (e) {
    console.warn(`⚠️ Error sending admission ads data:`, e);
  }
}

/// 💳 PAYMENT HISTORY DATA
export async function sendPaymentData({
  studentName,
  studentID,
  collegeName,
  collegeID,
  courseName,
  amount,
  UPI_ID,
  paymentDate,
  paymentStatus,
  paymentScreenshotURL,
  verifiedByCollege,
  remarks,
}: {
  studentName: string;
  studentID: string;
  collegeName: string;
  collegeID: string;
  courseName: string;
  amount: string;
  UPI_ID: string;
  paymentDate: string;
  paymentStatus: string;
  paymentScreenshotURL: string;
  verifiedByCollege: string;
  remarks: string;
}) {
  await sendToSheet("payment", {
    "studentName": studentName,
    "studentID": studentID,
    "collegeName": collegeName,
    "collegeID": collegeID,
    "courseName": courseName,
    "amount": amount,
    "UPI_ID": UPI_ID,
    "paymentDate": paymentDate,
    "paymentStatus": paymentStatus,
    "paymentScreenshotURL": paymentScreenshotURL,
    "verifiedByCollege": verifiedByCollege,
    "remarks": remarks,
  });
}
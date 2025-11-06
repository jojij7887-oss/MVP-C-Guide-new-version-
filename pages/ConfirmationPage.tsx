import React from 'react';
import { useLocation } from 'react-router-dom';
import jsPDF from 'jspdf';

const ConfirmationPage: React.FC = () => {
    const location = useLocation();
    const {
        admissionId,
        studentName,
        collegeName,
        courseName,
        admissionFee,
        submissionDate
    } = location.state || {};

    const handleDownload = () => {
        if (!admissionId) {
            alert("Admission details not found. Cannot generate PDF.");
            return;
        }

        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.setTextColor("#2563eb"); // Blue color for C Guide branding
        doc.text("C Guide Admission Confirmation", 105, 20, { align: "center" });
        doc.setLineWidth(0.5);
        doc.line(20, 25, 190, 25);

        // Body with application details
        doc.setTextColor("#000000");
        doc.setFontSize(12);

        const details = [
            { label: "Admission ID:", value: admissionId },
            { label: "Student Name:", value: studentName || 'N/A' },
            { label: "College Name:", value: collegeName || 'N/A' },
            { label: "Course Name:", value: courseName || 'N/A' },
            { label: "Admission Fee:", value: `₹${admissionFee?.toLocaleString() || '0'}` },
            { label: "Submission Date:", value: submissionDate ? new Date(submissionDate).toLocaleString() : new Date().toLocaleString() }
        ];

        let yPos = 40;
        details.forEach(detail => {
            doc.setFont("helvetica", "bold");
            doc.text(detail.label, 20, yPos);
            doc.setFont("helvetica", "normal");
            doc.text(String(detail.value), 70, yPos);
            yPos += 10;
        });

        // Footer
        doc.setLineWidth(0.5);
        doc.line(20, yPos + 5, 190, yPos + 5);
        doc.setFontSize(10);
        doc.setTextColor("#808080");
        doc.text("Thank you for choosing C Guide. Please keep this confirmation for your records.", 105, yPos + 15, { align: "center" });

        doc.save(`CGuide_Admission_${admissionId}.pdf`);
    };

    return (
        <div className="max-w-2xl mx-auto text-center bg-white p-10 rounded-lg shadow-lg">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100">
                <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h1 className="mt-6 text-3xl font-extrabold text-gray-900">Application Submitted!</h1>
            <p className="mt-2 text-lg text-gray-600">Your application has been submitted successfully.</p>

            <div className="mt-8 bg-gray-100 p-4 rounded-md">
                <p className="text-sm text-gray-500">Your Admission ID is:</p>
                <p className="text-2xl font-mono font-semibold text-indigo-600 tracking-wider">{admissionId || 'N/A'}</p>
                <p className="mt-2 text-sm text-gray-500">Please save this ID for future reference.</p>
            </div>

            <div className="mt-8 flex justify-center space-x-4">
                <button onClick={handleDownload} className="px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
                    Download Confirmation
                </button>
                <button disabled className="px-6 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    Email Confirmation
                </button>
            </div>
        </div>
    );
};

export default ConfirmationPage;
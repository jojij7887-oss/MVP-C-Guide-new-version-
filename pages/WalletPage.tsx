import React from 'react';
import { PaymentTransaction } from '../types';
import { WalletIcon, ArrowDownTrayIcon } from '../components/icons';

interface WalletPageProps {
  transactions: PaymentTransaction[];
}

const statusStyles: Record<PaymentTransaction['status'], { bg: string; text: string; }> = {
    Pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
    Confirmed: { bg: 'bg-green-100', text: 'text-green-800' },
    Failed: { bg: 'bg-red-100', text: 'text-red-800' },
};

const WalletPage: React.FC<WalletPageProps> = ({ transactions }) => {

  const handleDownloadReceipt = (transactionId: string) => {
    alert(`Downloading receipt for transaction ${transactionId}... (Simulated)`);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <div className="bg-indigo-100 p-3 rounded-full">
            <WalletIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <div>
            <h1 className="text-3xl font-bold text-gray-900">My Wallet</h1>
            <p className="mt-1 text-lg text-gray-600">View your admission fee payment history.</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-800 border-b pb-3 mb-4">Transaction History</h2>
        {transactions.length > 0 ? (
            <div className="space-y-4">
                {transactions.map(t => (
                    <div key={t.paymentId} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-gray-50">
                        <div className="flex-grow">
                            <p className="font-semibold text-indigo-700">{t.courseName}</p>
                            <p className="text-sm text-gray-600">{t.collegeName}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(t.paymentDate).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-4 sm:gap-6">
                            <p className="font-bold text-lg text-gray-800">₹{t.amount.toLocaleString()}</p>
                            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[t.status].bg} ${statusStyles[t.status].text}`}>
                                {t.status}
                            </span>
                            {t.status === 'Confirmed' && (
                                <button 
                                    onClick={() => handleDownloadReceipt(t.paymentId)}
                                    className="text-gray-500 hover:text-indigo-600"
                                    title="Download Receipt"
                                >
                                    <ArrowDownTrayIcon className="h-6 w-6" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center py-12">
                <p className="text-xl text-gray-500">No transactions yet.</p>
                <p className="text-gray-400 mt-2">Your payment history will appear here once you make a transaction.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default WalletPage;

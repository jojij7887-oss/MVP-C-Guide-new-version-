import React, { useState } from 'react';

interface TwoFactorAuthModalProps {
    email: string;
    onClose: () => void;
    onSuccess: () => void;
}

const TwoFactorAuthModal: React.FC<TwoFactorAuthModalProps> = ({ email, onClose, onSuccess }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    
    // In a real application, this would be a backend call.
    const SIMULATED_CORRECT_CODE = '123456';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsVerifying(true);

        setTimeout(() => {
            if (code === SIMULATED_CORRECT_CODE) {
                onSuccess();
            } else {
                setError('Invalid verification code. Please try again.');
            }
            setIsVerifying(false);
        }, 1000); // Simulate network delay
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
                <h2 className="text-2xl font-bold text-gray-800">Two-Factor Authentication</h2>
                <p className="mt-2 text-gray-600">For your security, please enter the 6-digit code sent to <span className="font-semibold">{email}</span>.</p>
                <p className="text-sm text-indigo-500 mt-2">(Hint: The code is {SIMULATED_CORRECT_CODE})</p>
                
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <input 
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        maxLength={6}
                        placeholder="_ _ _ _ _ _"
                        className="w-full p-3 text-center text-2xl tracking-[0.5em] font-mono border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        aria-label="Verification code"
                    />
                     {error && <p className="text-red-500 text-sm">{error}</p>}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button type="button" onClick={onClose} disabled={isVerifying} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isVerifying} className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                            {isVerifying ? 'Verifying...' : 'Verify'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorAuthModal;
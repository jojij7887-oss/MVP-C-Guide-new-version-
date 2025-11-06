import React, { useState } from 'react';
import { XMarkIcon } from './icons';

type WidgetKey = 'stats' | 'funnel' | 'engagement' | 'aiPredictions' | 'seatOccupancy';

interface WidgetConfig {
    visible: boolean;
    title: string;
}

interface CustomizeDashboardModalProps {
    widgets: Record<WidgetKey, WidgetConfig>;
    onClose: () => void;
    onSave: (updatedWidgets: Record<WidgetKey, WidgetConfig>) => void;
}

const Toggle: React.FC<{ enabled: boolean; onChange: (enabled: boolean) => void }> = ({ enabled, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!enabled)}
    className={`${
      enabled ? 'bg-indigo-600' : 'bg-gray-200'
    } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
  >
    <span
      className={`${
        enabled ? 'translate-x-5' : 'translate-x-0'
      } inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
    />
  </button>
);


const CustomizeDashboardModal: React.FC<CustomizeDashboardModalProps> = ({ widgets, onClose, onSave }) => {
    const [localWidgets, setLocalWidgets] = useState(widgets);

    const handleToggle = (key: WidgetKey) => {
        setLocalWidgets(prev => ({
            ...prev,
            [key]: { ...prev[key], visible: !prev[key].visible }
        }));
    };

    const handleSave = () => {
        onSave(localWidgets);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <header className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-800">Customize Dashboard</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </header>
                <main className="p-6 space-y-4">
                    <p className="text-sm text-gray-600">Select the widgets you want to display on your dashboard.</p>
                    {Object.entries(localWidgets).map(([key, config]: [string, WidgetConfig]) => (
                        <div key={key} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                            <span className="font-medium text-gray-700">{config.title}</span>
                            <Toggle enabled={config.visible} onChange={() => handleToggle(key as WidgetKey)} />
                        </div>
                    ))}
                </main>
                <footer className="px-6 py-3 bg-gray-50 text-right">
                    <button 
                        onClick={handleSave}
                        className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700"
                    >
                        Save Preferences
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CustomizeDashboardModal;
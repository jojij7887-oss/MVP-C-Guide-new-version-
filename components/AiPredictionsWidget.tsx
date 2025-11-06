
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import { SparklesIcon } from './icons';

const AiPredictionsWidget: React.FC = () => {
    const [prediction, setPrediction] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        setIsLoading(true);
        setError(null);
        setPrediction(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            // Mock historical data for the prompt
            const historicalData = `
                - January: 150 applications (Computer Science: 60, Electrical Engineering: 40, Fine Arts: 50)
                - February: 180 applications (Computer Science: 75, Electrical Engineering: 45, Fine Arts: 60)
                - March: 210 applications (Computer Science: 90, Electrical Engineering: 50, Fine Arts: 70)
            `;
            const prompt = `Based on the following historical application data for our university:\n${historicalData}\n\nPredict the application trend for the next quarter (April-June). Provide a short, easy-to-read summary of the overall trend, identify which course is likely to see the most growth, and give a brief reasoning. Format the output as a simple paragraph.`;
            
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });

            setPrediction(response.text);

        } catch (e) {
            setError('Failed to generate predictions. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
            <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                <SparklesIcon className="h-6 w-6 text-purple-500" />
                AI Trend Predictions
            </h2>
            <div className="flex-grow">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 animate-pulse">Generating insights...</p>
                    </div>
                )}
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {prediction && (
                    <div className="prose prose-sm max-w-none text-gray-700 bg-indigo-50 p-3 rounded-md">
                        <p>{prediction}</p>
                    </div>
                )}
            </div>
            <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="mt-4 w-full bg-purple-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
            >
                {isLoading ? 'Analyzing...' : 'Generate Next Quarter Prediction'}
            </button>
        </div>
    );
};

export default AiPredictionsWidget;

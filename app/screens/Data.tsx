'use client';

import React, { useState, useEffect } from 'react';

declare global {
  interface Window {
    FlutterBridge: {
      postMessage: (message: string) => void;
    };
    receiveDataFromFlutter: (data: string) => void;
  }
}

const DataScreen = () => {
  const [data, setData] = useState<any>(null);
  const [flutterData, setFlutterData] = useState<string>('');

  const executeProcess = async () => {
    try {
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: 'Gemini', value: Math.random() }),
      });
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error executing process:', error);
      setData({ message: 'Error executing process' });
    }
  };

  const getResults = async () => {
    try {
      const response = await fetch('/api/results');
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error getting results:', error);
      setData({ message: 'Error getting results' });
    }
  };

  const sendToFlutter = () => {
    if (window.FlutterBridge) {
      window.FlutterBridge.postMessage('Hello from Next.js!');
    }
  };

  useEffect(() => {
    window.receiveDataFromFlutter = (data: string) => {
      setFlutterData(data);
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Data Interaction</h1>
      <div className="space-y-4">
        <button onClick={executeProcess} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Execute Process
        </button>
        <button onClick={getResults} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Get Results
        </button>
        <button onClick={sendToFlutter} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          Send to Flutter
        </button>
      </div>
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl font-semibold">API Result</h2>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      <div className="mt-4 p-4 border rounded">
        <h2 className="text-xl font-semibold">Data from Flutter</h2>
        <p>{flutterData}</p>
      </div>
    </div>
  );
};

export default DataScreen;
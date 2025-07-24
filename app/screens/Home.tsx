
'use client';
import React, { useState } from 'react';

// FlutterのJavaScriptChannelと通信するための型定義
interface FlutterChannel {
  postMessage(message: string): void;
}

// windowオブジェクトにFlutterチャンネルを定義
declare global {
  interface Window {
    Flutter?: FlutterChannel;
  }
}

const Home = () => {
  const [apiStatus, setApiStatus] = useState('');

  // Flutterに単純な文字列を送信する
  const sendStringToFlutter = () => {
    const message = "Hello from Next.js!";
    if (window.Flutter) {
      window.Flutter.postMessage(message);
      console.log('Sent to Flutter:', message);
    } else {
      console.log('Flutter channel is not available.');
    }
  };

  // Flutterに複雑なJSONを送信する
  const sendJsonToFlutter = () => {
    const jsonData = {
      path: "/map",
      data: {
        id: 123,
        source: "web"
      }
    };
    const message = JSON.stringify(jsonData);
    if (window.Flutter) {
      window.Flutter.postMessage(message);
      console.log('Sent to Flutter:', message);
    } else {
      console.log('Flutter channel is not available.');
    }
  };

  // APIを叩いて結果をFlutterに送信する
  const sendApiResultToFlutter = async () => {
    setApiStatus('Loading...');
    try {
      // NOTE: NEXT_PUBLIC_API_URLが環境変数に設定されている必要があります
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/stations`);
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      const data = await response.json();
      const message = JSON.stringify(data);
      
      if (window.Flutter) {
        window.Flutter.postMessage(message);
        setApiStatus('API result sent to Flutter successfully!');
        console.log('Sent API result to Flutter:', message);
      } else {
        setApiStatus('Flutter channel is not available.');
        console.log('Flutter channel is not available.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setApiStatus(`Failed to send API result: ${errorMessage}`);
      console.error('API call or message sending failed:', error);
    }
  };


  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold">Home Screen</h1>
      <div className="mt-4 space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
        <button onClick={sendStringToFlutter} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Flutterにデータを送信
        </button>
        <button onClick={sendJsonToFlutter} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          画面遷移
        </button>
        <button onClick={sendApiResultToFlutter} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          API結果をFlutterに送信
        </button>
      </div>
      {apiStatus && (
        <div className="mt-4 p-2 text-sm text-gray-600">
          {apiStatus}
        </div>
      )}
    </div>
  );
};

export default Home;


'use client';
import React, { useState, useEffect } from 'react';

// 認証データの型定義
interface AuthData {
  accessToken: string;
  userId: string;
}

// FlutterのJavaScriptChannelと通信するための型定義
interface FlutterChannel {
  postMessage(message: string): void;
}

// ネイティブからWebへのメッセージの型定義
interface NativeMessage {
  type: 'authData' | string; // 拡張可能なメッセージタイプ
  payload: any;
}

// windowオブジェクトにグローバル関数とFlutterチャンネルを定義
declare global {
  interface Window {
    // [入口] ネイティブからのメッセージを受け取る汎用ハンドラ
    handleNativeMessage?: (messageString: string) => void;
    // [出口] ネイティブへメッセージを送信するチャンネル
    Flutter?: FlutterChannel;
  }
}

const Profile = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);

  useEffect(() => {
    // [入口] ネイティブからの全てのメッセージを受け取る汎用ハンドラを定義
    window.handleNativeMessage = (messageString: string) => {
      try {
        const message: NativeMessage = JSON.parse(messageString);
        console.log('Received message from native:', message);

        // メッセージのタイプに応じて処理を振り分ける
        switch (message.type) {
          case 'authData':
            // payloadがAuthDataの形式であることを確認（簡易的なチェック）
            if (message.payload && message.payload.accessToken && message.payload.userId) {
              setAuthData(message.payload);
            } else {
              console.error('Invalid authData payload:', message.payload);
            }
            break;
          default:
            console.warn('Unknown message type received:', message.type);
        }
      } catch (error) {
        console.error('Failed to handle native message:', messageString, error);
      }
    };

    // クリーンアップ処理
    return () => {
      delete window.handleNativeMessage;
    };
  }, []);

  // [出口] Flutterにログアウトを通知する
  const handleLogout = () => {
    if (window.Flutter) {
      const message = JSON.stringify({ type: 'logout' });
      window.Flutter.postMessage(message);
      console.log('Sent logout message to Flutter');
      // Web側では表示を初期状態に戻す
      setAuthData(null);
    } else {
      console.log('Flutter channel is not available.');
      alert('Logout function is not available outside of the app.');
    }
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold">Profile Screen</h1>
      <div className="mt-8 w-full max-w-md mx-auto">
        {authData ? (
          <div className="p-6 border rounded-lg shadow-lg bg-white text-left">
            <h2 className="text-2xl font-semibold mb-4">Authentication Data</h2>
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-500">Access Token:</p>
                <p className="text-gray-800 bg-gray-100 p-2 rounded break-words">{authData.accessToken}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">User ID:</p>
                <p className="text-gray-800 bg-gray-100 p-2 rounded">{authData.userId}</p>
              </div>
              <button onClick={handleLogout} className="w-full mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                ログアウト
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 border rounded-lg shadow-lg bg-white">
            <p className="text-lg text-gray-600">Waiting for authentication data from the native app...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

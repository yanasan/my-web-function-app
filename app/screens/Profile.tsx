
'use client';
import React, { useState, useEffect } from 'react';

// Nativeから受け取る認証データの型定義
interface AuthData {
  accessToken: string;
  userId: string;
}

// APIから取得するユーザー情報の型定義 (一旦anyで定義)
type UserData = any;

// windowオブジェクトにAuthDataのインターフェースを定義
declare global {
  interface Window {
    authData?: {
      sendAuthData: (authData: AuthData) => void;
    };
  }
}

const Profile = () => {
  const [authData, setAuthData] = useState<AuthData | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Native側から呼び出される関数をwindowオブジェクトに定義
    window.authData = {
      sendAuthData: (receivedAuthData: AuthData) => {
        console.log('Received authData from native:', receivedAuthData);
        if (receivedAuthData && receivedAuthData.accessToken && receivedAuthData.userId) {
          setAuthData(receivedAuthData);
        } else {
          console.error('Invalid authData payload:', receivedAuthData);
          setError('Invalid authentication data received from the native app.');
        }
      },
    };

    // クリーンアップ処理
    return () => {
      delete window.authData;
    };
  }, []); // このuseEffectはマウント時に一度だけ実行

  useEffect(() => {
    // authDataがセットされたら、ユーザー情報を取得するAPIを叩く
    if (authData) {
      const fetchUserData = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch('/api/v1/auth/me', {
            headers: {
              'Authorization': `Bearer ${authData.accessToken}`,
            },
          });

          if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
          }

          const data: UserData = await response.json();
          setUserData(data);
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : 'Unknown error';
          setError(errorMessage);
          console.error('Failed to fetch user data:', e);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    }
  }, [authData]); // authDataが変更されるたびに実行

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold">Profile Screen</h1>
      <div className="mt-8 w-full max-w-2xl mx-auto">
        
        {/* 認証データ表示エリア */}
        <div className="p-6 border rounded-lg shadow-lg bg-white text-left mb-8">
          <h2 className="text-2xl font-semibold mb-4">Authentication Data (from Native)</h2>
          {authData ? (
            <div className="space-y-4">
              <div>
                <p className="font-medium text-gray-500">Access Token:</p>
                <p className="text-gray-800 bg-gray-100 p-2 rounded break-words">{authData.accessToken}</p>
              </div>
              <div>
                <p className="font-medium text-gray-500">User ID:</p>
                <p className="text-gray-800 bg-gray-100 p-2 rounded">{authData.userId}</p>
              </div>
            </div>
          ) : (
            <p className="text-lg text-gray-600">Waiting for authentication data from the native app...</p>
          )}
        </div>

        {/* ユーザー情報表示エリア */}
        <div className="p-6 border rounded-lg shadow-lg bg-white text-left">
          <h2 className="text-2xl font-semibold mb-4">User Data (from API)</h2>
          {loading && <p className="text-lg text-gray-600">Loading user data...</p>}
          {error && <p className="text-lg text-red-500">Error: {error}</p>}
          {userData && (
            <div className="space-y-4">
              {Object.entries(userData).map(([key, value]) => (
                <div key={key}>
                  <p className="font-medium text-gray-500 capitalize">{key}:</p>
                  <p className="text-gray-800 bg-gray-100 p-2 rounded break-words">{JSON.stringify(value)}</p>
                </div>
              ))}
            </div>
          )}
          {!authData && !loading && !error &&
            <p className="text-lg text-gray-600">User data will be fetched after receiving auth data.</p>
          }
        </div>

      </div>
    </div>
  );
};

export default Profile;

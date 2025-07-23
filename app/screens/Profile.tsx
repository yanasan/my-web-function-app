
'use client';
import React, { useState } from 'react';

const Profile = () => {
  const [apiResult, setApiResult] = useState(null);

  const callApi = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setApiResult({ error: 'You are not logged in.' } as any);
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setApiResult(data);
    } catch (error) {
      console.error('API call failed:', error);
      setApiResult({ error: 'Failed to fetch data.' } as any);
    }
  };

  return (
    <div className="container mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold">Profile Screen</h1>
      <button onClick={callApi} className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Call API
      </button>
      {apiResult && (
        <div className="mt-4 p-4 border rounded w-full max-w-4xl mx-auto text-left">
          <h2 className="text-xl font-semibold">API Result</h2>
          <pre className="bg-gray-100 p-2 rounded mt-2 whitespace-pre-wrap">{JSON.stringify(apiResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default Profile;

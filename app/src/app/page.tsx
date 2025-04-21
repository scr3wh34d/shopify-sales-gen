"use client"; // Need client-side interaction for form/redirect

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link

export default function HomePage() {
  const [shop, setShop] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (shop) {
      // Basic validation for .myshopify.com
      if (shop.includes('.myshopify.com')) {
        window.location.href = `/api/auth/shopify?shop=${encodeURIComponent(shop)}`;
      } else {
        alert('Please enter a valid shop domain (e.g., your-store-name.myshopify.com)');
      }
    } else {
      alert('Please enter your shop domain.');
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-24 bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">Shopify Sales Dashboard</h1>
        <p className="text-md text-gray-600 mb-6">
          View your shop analytics.
        </p>
        <Link 
          href="/dashboard"
          className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out"
        >
          Go to Dashboard
        </Link>
      </div>
    </main>
  );
}

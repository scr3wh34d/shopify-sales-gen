"use client";

import React, { useMemo, useState } from 'react';
import { useOrders } from '@/lib/apollo/hooks/useOrders';
import { OrderEdge } from '@/lib/apollo/types/orders';
import { subDays, format, parseISO } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Reusable Loading and Error components (Consider moving to shared files)
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  );
}

// New interface for product quantity data
interface ProductQuantityData {
  productTitle: string; // Use title for display
  quantity: number;
}

// New helper function to aggregate quantity by product/variant title
function aggregateProductQuantity(orderEdges: OrderEdge[]): ProductQuantityData[] {
  if (!orderEdges) return [];

  const quantityMap = new Map<string, number>(); // Map: productTitle -> totalQuantity

  orderEdges.forEach(({ node: order }) => {
    order.lineItems?.edges?.forEach(({ node: item }) => {
      const productTitle = item.variant?.product?.title || item.title || 'Unknown Product'; // Use variant product title, fallback to line item title
      const quantity = item.quantity;

      quantityMap.set(productTitle, (quantityMap.get(productTitle) || 0) + quantity);
    });
  });

  // Convert map to array and sort by quantity (descending) or alphabetically
  return Array.from(quantityMap.entries())
    .map(([productTitle, quantity]) => ({ productTitle, quantity }))
    .sort((a, b) => b.quantity - a.quantity); // Sort by quantity descending
}

export function SalesComparisonChart() {
  const today = new Date();
  const [startDate, setStartDate] = useState(() => format(subDays(today, 30), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(() => format(today, 'yyyy-MM-dd'));

  const { loading, error, data } = useOrders({
    first: 250, // Keep fetching enough orders for the period
    startDate: startDate,
    endDate: endDate,
  });

  // Use the new aggregation function
  const productQuantities = useMemo(() => aggregateProductQuantity(data?.edges || []), [data]);

  // Prepare data for the BarChart
  const chartData = useMemo(() => {
    // Limit the number of products shown for clarity, e.g., top 10
    const topProducts = productQuantities.slice(0, 10);
    return topProducts.map(item => ({
      name: item.productTitle, // Use 'name' for XAxis dataKey
      Quantity: item.quantity, // Use 'Quantity' for Bar dataKey
    }));
  }, [productQuantities]);

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndDate(e.target.value);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-4">
        <h2 className="text-xl font-semibold">Product Quantity Sold</h2>
        <div className="flex items-center flex-wrap justify-center sm:justify-end gap-2">
          <label htmlFor="start-date" className="text-sm font-medium text-gray-600">From:</label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={handleStartDateChange}
            className="text-sm border border-gray-300 rounded px-2 py-1 w-auto"
          />
          <label htmlFor="end-date" className="text-sm font-medium text-gray-600">To:</label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={handleEndDateChange}
            className="text-sm border border-gray-300 rounded px-2 py-1 w-auto"
          />
        </div>
      </div>

      {/* Chart Section */}
      {loading && <LoadingSpinner />}
      {error && <ErrorDisplay message={`Failed to load order data: ${error.message}`} />}
      {!loading && !error && chartData.length === 0 && (
        <p className="text-gray-600 text-center py-4">No product sales data available for the selected period.</p>
      )}
      {!loading && !error && chartData.length > 0 && (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 75 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={{ fontSize: 10 }}
              interval={0}
            />
            <Tooltip formatter={(value: number) => `${value.toLocaleString()} units`} />
            <Legend />
            <Bar dataKey="Quantity" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
} 
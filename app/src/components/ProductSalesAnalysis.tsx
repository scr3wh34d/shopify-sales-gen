"use client";

import React, { useMemo } from 'react';
import { useOrders } from '@/lib/apollo/hooks/useOrders';
import { OrderEdge } from '@/lib/apollo/types/orders';
import Papa from 'papaparse';
import { format } from 'date-fns';

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

interface ProductSales {
  productId: string;
  productTitle: string;
  totalQuantitySold: number;
  totalRevenue: number;
}

// Helper function to process order data into product sales summary
function calculateProductSales(orderEdges: OrderEdge[]): ProductSales[] {
  if (!orderEdges) return [];

  const salesMap = new Map<string, ProductSales>();

  orderEdges.forEach(({ node: order }) => {
    order.lineItems?.edges?.forEach(({ node: item }) => {
      const product = item.variant?.product;
      if (!product) return; // Skip if product info is missing

      const productId = product.id;
      const price = parseFloat(item.discountedUnitPriceSet.shopMoney.amount);
      const quantity = item.quantity;

      if (isNaN(price)) return; // Skip if price is invalid

      const revenue = price * quantity;

      if (salesMap.has(productId)) {
        const existing = salesMap.get(productId)!;
        existing.totalQuantitySold += quantity;
        existing.totalRevenue += revenue;
      } else {
        salesMap.set(productId, {
          productId,
          productTitle: product.title,
          totalQuantitySold: quantity,
          totalRevenue: revenue,
        });
      }
    });
  });

  // Convert map to array and sort by revenue (descending)
  return Array.from(salesMap.values()).sort((a, b) => b.totalRevenue - a.totalRevenue);
}

// Function to trigger CSV download
function downloadCSV(data: ProductSales[], filename: string) {
  const csvData = data.map(item => ({
    'Product ID': item.productId.split('/').pop(), // Extract numeric ID if desired
    'Product Title': item.productTitle,
    'Quantity Sold': item.totalQuantitySold,
    'Total Revenue': item.totalRevenue.toFixed(2), // Format to 2 decimal places
  }));

  const csv = Papa.unparse(csvData);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function ProductSalesAnalysis() {
  // Example: Fetch last 100 orders (adjust as needed)
  // TODO: Add date range filtering via the query variable
  const { loading, error, data } = useOrders({ first: 100 });

  // Memoize the calculation to avoid re-computing on every render
  const productSales = useMemo(() => {
    return calculateProductSales(data?.edges || []);
  }, [data]);

  const handleExport = () => {
    if (productSales.length > 0) {
      const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
      downloadCSV(productSales, `product_sales_summary_${timestamp}.csv`);
    } else {
      alert('No sales data available to export.');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorDisplay message={`Failed to load order data: ${error.message}`} />;
  }

  if (!productSales || productSales.length === 0) {
    return <p className="text-gray-600">No sales data available for analysis.</p>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Product Sales Summary</h2>
        <button
          onClick={handleExport}
          disabled={productSales.length === 0}
          className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity Sold</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Revenue</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {productSales.map((product) => (
              <tr key={product.productId}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.productTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.totalQuantitySold}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${product.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* TODO: Add pagination or load more for orders if needed */}
    </div>
  );
} 
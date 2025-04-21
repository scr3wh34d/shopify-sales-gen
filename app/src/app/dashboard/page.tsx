"use client"; // Using the useProducts hook requires this to be a Client Component

import React from 'react';
import { useProducts } from '@/lib/apollo/hooks/useProducts';
import { calculateTotalInventoryValue, countLowInventoryProducts } from '@/lib/utils/productAnalytics';
import { ProductSalesAnalysis } from '@/components/ProductSalesAnalysis';
import { SalesComparisonChart } from '@/components/SalesComparisonChart';
import { InventoryStatus } from '@/components/InventoryStatus';
import ErrorBoundary from '@/components/ErrorBoundary'; // Import ErrorBoundary

// Basic Loading Component (consider creating a shared LoadingSpinner.tsx)
function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-8">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    </div>
  );
}

// Basic Error Component
function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
      <strong className="font-bold">Error:</strong>
      <span className="block sm:inline"> {message}</span>
    </div>
  );
}

// Fallback UI for metrics if products fail to load initially
const MetricsErrorFallback = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
        <div className="h-8 bg-gray-300 rounded w-1/2"></div>
      </div>
    ))}
  </div>
);

export default function DashboardPage() {
  // Pass the fetchMore function down
  const { loading: productsLoading, error: productsError, data: productsData, fetchMore: fetchMoreProducts } = useProducts({ first: 20 }); // Reduced initial fetch

  if (productsLoading && !productsData) { // Show initial loading spinner only
    return <LoadingSpinner />;
  }

  if (productsError && !productsData) { // Show initial error only
    return <ErrorDisplay message={productsError?.message || 'Failed to load initial product data.'} />;
  }

  // Calculations should handle potentially null data initially
  const totalInventoryValue = productsData ? calculateTotalInventoryValue(productsData.edges) : 0;
  const lowStockCount = productsData ? countLowInventoryProducts(productsData.edges, 10) : 0;
  const totalProductsFetched = productsData?.edges?.length ?? 0;

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Key Metrics Section with Error Boundary */}
      <ErrorBoundary fallback={<MetricsErrorFallback />}>
        {productsError && !productsData ? (
          <MetricsErrorFallback />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Total Inventory Value</h2>
              <p className="text-3xl font-bold">
                ${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Low Stock Items (&lt;= 10)</h2>
              <p className="text-3xl font-bold">{lowStockCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-600 mb-2">Products Fetched</h2> {/* Changed label */}
              <p className="text-3xl font-bold">{totalProductsFetched}</p>
            </div>
          </div>
        )}
      </ErrorBoundary>

      {/* Sales Comparison Chart Section with Error Boundary */}
      <ErrorBoundary>
        <SalesComparisonChart />
      </ErrorBoundary>

      {/* Inventory Status Section with Error Boundary */}
      <ErrorBoundary>
        {productsData ? (
          <InventoryStatus
            productEdges={productsData.edges}
            pageInfo={productsData.pageInfo}
            fetchMore={fetchMoreProducts}
            isLoadingMore={productsLoading} // Pass loading state for button feedback
          />
        ) : productsError ? (
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
            <ErrorDisplay message={productsError.message || 'Failed to load inventory data.'} />
          </div>
        ) : null /* Render nothing if no data/error and still initial loading? Could show skeleton */}
      </ErrorBoundary>

      {/* Product Sales Analysis Section with Error Boundary */}
      <ErrorBoundary>
        <ProductSalesAnalysis />
      </ErrorBoundary>

      {/* Placeholder for future charts */}
      {/* <SalesCharts /> */}

    </div>
  );
} 
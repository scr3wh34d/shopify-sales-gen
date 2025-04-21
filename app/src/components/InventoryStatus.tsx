"use client"; // Needs access to client-side data potentially passed as props

import React from 'react';
import { ProductEdge, PageInfo } from '@/lib/apollo/types/products'; // Import types

interface InventoryItem {
  productId: string;
  productTitle: string;
  variantId: string;
  variantTitle: string;
  sku: string | null;
  inventoryQuantity: number | null;
}

// Helper function to flatten product data into inventory items
function flattenInventoryData(productEdges: ProductEdge[]): InventoryItem[] {
  if (!productEdges) return [];

  const inventoryItems: InventoryItem[] = [];
  productEdges.forEach(edge => {
    const product = edge.node;
    if (!product || !product.variants || !product.variants.edges) return;

    product.variants.edges.forEach(variantEdge => {
      const variant = variantEdge.node;
      inventoryItems.push({
        productId: product.id,
        productTitle: product.title,
        variantId: variant.id,
        variantTitle: variant.title,
        sku: variant.sku,
        inventoryQuantity: variant.inventoryQuantity,
      });
    });
  });

  // Sort by quantity (ascending) to show low stock first
  return inventoryItems.sort((a, b) => (a.inventoryQuantity ?? Infinity) - (b.inventoryQuantity ?? Infinity));
}

interface InventoryStatusProps {
  productEdges: ProductEdge[];
  pageInfo: PageInfo; // Add pageInfo prop
  fetchMore?: () => Promise<any>; // Add fetchMore prop
  isLoadingMore?: boolean; // Add loading state prop
  lowStockThreshold?: number;
}

export function InventoryStatus({
  productEdges,
  pageInfo,
  fetchMore,
  isLoadingMore,
  lowStockThreshold = 10
}: InventoryStatusProps) {
  const inventoryData = flattenInventoryData(productEdges);

  if (!inventoryData || inventoryData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Inventory Status</h2>
        <p className="text-gray-600">No product inventory data available.</p>
      </div>
    );
  }

  const handleLoadMore = () => {
    if (fetchMore) {
      fetchMore();
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-4">
      <h2 className="text-xl font-semibold">Inventory Status</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Variant</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventoryData.map((item) => {
              const isLowStock = item.inventoryQuantity !== null && item.inventoryQuantity <= lowStockThreshold;
              return (
                <tr key={item.variantId} className={isLowStock ? 'bg-red-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.productTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.variantTitle}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.sku ?? 'N/A'}</td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${isLowStock ? 'text-red-600' : 'text-gray-700'}`}>
                    {item.inventoryQuantity ?? 'Tracked Off'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageInfo.hasNextPage && (
        <div className="flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-wait"
          >
            {isLoadingMore ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
    </div>
  );
} 
### Shopify Inventory Management Project Specification

## Project Overview

This document outlines the technical specifications for a Shopify inventory management application built with Next.js and TypeScript. The application will query the Shopify GraphQL API to analyze product sales over 30, 60, and 90-day periods while displaying current stock levels.

## Technical Stack

- **Frontend Framework**: Next.js 14+ (App Router) 
- **Language**: TypeScript 5.0+
- **API**: Shopify Admin GraphQL API (2024-01 or latest stable version)
- **Styling**: Tailwind CSS
- **State Management**: React Context API / React Query
- **Authentication**: Next.js middleware with Shopify OAuth
- **Deployment**: Vercel


## Core Features

1. **Authentication & Authorization**

1. Secure login using Shopify OAuth
2. Role-based access control



2. **Dashboard**

1. Overview of inventory metrics
2. Quick access to low stock items
3. Sales trends visualization



3. **Product Analysis**

1. Sales data for 30/60/90 day periods
2. Comparison charts between time periods
3. Growth/decline indicators



4. **Inventory Management**

1. Current stock levels
2. Low stock alerts
3. Restock recommendations



5. **Reporting**

1. Exportable reports (CSV, PDF)
2. Scheduled report generation
3. Custom date range filtering





## Technical Implementation

### 1. Shopify API Integration

```typescript
// lib/shopify.ts
import { GraphQLClient } from 'graphql-request';

export const shopifyClient = new GraphQLClient(
  `https://${process.env.SHOPIFY_STORE_DOMAIN}/admin/api/2024-01/graphql.json`,
  {
    headers: {
      'X-Shopify-Access-Token': process.env.SHOPIFY_ADMIN_API_TOKEN,
      'Content-Type': 'application/json',
    },
  }
);

export async function fetchProductSales(productId: string, days: 30 | 60 | 90) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const query = `
    query ProductSales($productId: ID!, $startDate: DateTime!) {
      product(id: $productId) {
        id
        title
        variants(first: 50) {
          edges {
            node {
              id
              title
              inventoryQuantity
              inventoryItem {
                id
              }
            }
          }
        }
        orders(first: 100, query: "created_at:>=${startDate.toISOString()}") {
          edges {
            node {
              id
              createdAt
              lineItems(first: 100) {
                edges {
                  node {
                    quantity
                    variantId
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  
  return shopifyClient.request(query, {
    productId,
    startDate: startDate.toISOString(),
  });
}
```

### 2. Data Fetching with Server Components

```typescript
// app/products/[id]/page.tsx
import { fetchProductSales } from '@/lib/shopify';
import ProductAnalytics from '@/components/product-analytics';
import InventoryStatus from '@/components/inventory-status';

export default async function ProductPage({ params }: { params: { id: string } }) {
  const thirtyDayData = await fetchProductSales(params.id, 30);
  const sixtyDayData = await fetchProductSales(params.id, 60);
  const ninetyDayData = await fetchProductSales(params.id, 90);
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Product Analysis</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InventoryStatus product={thirtyDayData.product} />
        <ProductAnalytics 
          thirtyDayData={thirtyDayData} 
          sixtyDayData={sixtyDayData}
          ninetyDayData={ninetyDayData}
        />
      </div>
    </div>
  );
}
```

### 3. Authentication Setup

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyShopifySession } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const isAuthenticated = await verifyShopifySession(request);
  
  if (!isAuthenticated && !request.nextUrl.pathname.startsWith('/auth')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|auth).*)',
  ],
};
---

# API Requirements

The application will need the following Shopify Admin API access scopes:

- `read_products`
- `read_orders`
- `read_inventory`
- `read_analytics`


## Environment Variables

```plaintext
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_ADMIN_API_TOKEN=your-admin-api-token
SHOPIFY_API_KEY=your-api-key
SHOPIFY_API_SECRET=your-api-secret
NEXTAUTH_SECRET=your-nextauth-secret
NEXTAUTH_URL=http://localhost:3000
```

## Performance Considerations

1. Implement proper data caching to minimize API calls
2. Use React Server Components for data-fetching operations
3. Implement pagination for large datasets
4. Use dynamic imports for heavy components
5. Optimize images and assets


## Testing Strategy

1. Unit tests for utility functions
2. Component tests for UI elements
3. Integration tests for API interactions
4. End-to-end tests for critical user flows



---

This technical specification provides a comprehensive guide for implementing a Shopify inventory management system using Next.js and TypeScript. The engineering team should use this document as a starting point and may need to adjust specific implementation details based on the exact requirements and constraints of the project.
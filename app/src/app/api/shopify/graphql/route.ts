import { NextRequest, NextResponse } from 'next/server';

const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL;
const apiVersion = process.env.SHOPIFY_ADMIN_API_VERSION || '2024-04';
const adminApiAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_API_ACCESS_TOKEN;

export async function POST(request: NextRequest) {
  if (!storeDomain || !adminApiAccessToken) {
    return NextResponse.json(
      { error: 'Missing Shopify credentials' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    
    const shopifyResponse = await fetch(
      `https://${storeDomain.replace(/^https?:\/\//, '')}/admin/api/${apiVersion}/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': adminApiAccessToken,
        },
        body: JSON.stringify(body),
      }
    );

    const data = await shopifyResponse.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Shopify API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch from Shopify' },
      { status: 500 }
    );
  }
} 
/**
 * Represents a single Product Variant node from the GraphQL query.
 */
export interface ProductVariant {
  id: string;
  title: string;
  price: string; // Prices are often returned as strings
  sku: string | null;
  inventoryQuantity: number | null;
}

/**
 * Represents the structure for edges containing ProductVariant nodes.
 */
export interface ProductVariantEdge {
  node: ProductVariant;
}

/**
 * Represents a single Product node from the GraphQL query.
 */
export interface Product {
  id: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  featuredImage: {
    url: string;
    altText: string | null;
  } | null;
  variants: {
    edges: ProductVariantEdge[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

/**
 * Represents the structure for edges containing Product nodes and a cursor.
 */
export interface ProductEdge {
  cursor: string;
  node: Product;
}

/**
 * Represents the page information for pagination.
 */
export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}

/**
 * Represents the overall data structure returned by the GET_PRODUCTS_QUERY.
 */
export interface GetProductsData {
  products: {
    edges: ProductEdge[];
    pageInfo: PageInfo;
  };
}

/**
 * Represents the variables expected by the GET_PRODUCTS_QUERY.
 */
export interface GetProductsVars {
  first: number;
  after?: string | null;
} 
import { PageInfo } from './products'; // Reuse PageInfo if structure is identical

// Interfaces for Money types
interface Money {
  amount: string;
  currencyCode: string;
}

// Interface for Order Customer
interface OrderCustomer {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
}

// Interface for Order Line Item Product
interface LineItemProduct {
  id: string;
  title: string;
  handle: string;
}

// Interface for Order Line Item Variant
interface LineItemVariant {
  id: string;
  title: string;
  sku: string | null;
  product: LineItemProduct;
}

// Interface for Order Line Item
interface LineItem {
  title: string;
  quantity: number;
  variant: LineItemVariant | null;
  originalUnitPriceSet: {
    shopMoney: Money;
  };
  discountedUnitPriceSet: {
    shopMoney: Money;
  };
}

// Interface for Order Line Item Edge
interface LineItemEdge {
  node: LineItem;
}

// Interface for Order Node
export interface Order {
  id: string;
  name: string;
  processedAt: string; // ISO Date string
  displayFinancialStatus: string; // e.g., PAID, PENDING, REFUNDED
  displayFulfillmentStatus: string; // e.g., FULFILLED, UNFULFILLED, PARTIALLY_FULFILLED
  totalPriceSet: {
    shopMoney: Money;
  };
  customer: OrderCustomer | null;
  lineItems: {
    edges: LineItemEdge[];
  };
}

// Interface for Order Edge
export interface OrderEdge {
  cursor: string;
  node: Order;
}

// Interface for the overall data structure of GET_ORDERS_QUERY
export interface GetOrdersData {
  orders: {
    edges: OrderEdge[];
    pageInfo: PageInfo;
  };
}

// Interface for the variables of GET_ORDERS_QUERY
export interface GetOrdersVars {
  first: number;
  after?: string | null;
  // query?: string | null; // Let the hook handle query generation
  startDate?: string; // ISO Date string YYYY-MM-DD
  endDate?: string; // ISO Date string YYYY-MM-DD
} 
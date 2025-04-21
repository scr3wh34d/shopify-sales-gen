import { gql } from '@apollo/client';

// NOTE: Accessing order data requires appropriate Shopify scopes (e.g., read_orders)

export const GET_ORDERS_QUERY = gql`
  query GetOrders($first: Int!, $after: String, $query: String) {
    orders(first: $first, after: $after, query: $query, sortKey: PROCESSED_AT, reverse: true) {
      edges {
        cursor
        node {
          id
          name
          processedAt
          lineItems(first: 20) {
            edges {
              node {
                quantity
                title
                variant {
                  product {
                    title
                  }
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;
import { useQuery, ApolloError } from '@apollo/client';
import { GET_PRODUCTS_QUERY } from '../queries/getProducts';
import { GetProductsData, GetProductsVars, PageInfo, ProductEdge } from '../types/products'; // Import specific types

// TODO: Define proper TypeScript types based on the query schema
interface Product {
  id: string;
  title: string;
  // Add other fields from the query
}

interface ProductsData {
  products: {
    edges: Array<{ node: Product; cursor: string }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
}

interface ProductsVars {
  first: number;
  after?: string | null;
}

interface UseProductsResult {
  loading: boolean;
  error?: ApolloError | Error;
  data?: {
    edges: ProductEdge[];
    pageInfo: PageInfo;
  }; // Use imported types
  fetchMore?: () => Promise<any>; // fetchMore doesn't need variables argument here
}

export const useProducts = (variables: GetProductsVars): UseProductsResult => {
  const { loading, error, data, fetchMore: apolloFetchMore } = useQuery<GetProductsData, GetProductsVars>(
    GET_PRODUCTS_QUERY,
    {
      variables,
      notifyOnNetworkStatusChange: true, // Helps show loading state during fetchMore
    }
  );

  // Basic error logging
  if (error) {
    console.error("Error fetching products:", error);
  }

  const fetchMore = apolloFetchMore && data?.products.pageInfo.hasNextPage
    ? () => // No need for variables argument here, use existing data
        apolloFetchMore({
          variables: {
            // Keep original 'first', update 'after' from current data
            first: variables.first,
            after: data?.products.pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            // Prevent duplicates if fetchMore is called rapidly
            if (!prev.products || !fetchMoreResult.products) return prev;
            
            const newEdges = fetchMoreResult.products.edges;
            const prevEdges = prev.products.edges;
            const combinedEdges = [...prevEdges, ...newEdges];
            // Simple deduplication based on cursor (more robust might use ID)
            const uniqueEdges = Array.from(new Map(combinedEdges.map(edge => [edge.cursor, edge])).values());

            return {
              products: {
                ...fetchMoreResult.products, // Use new pageInfo
                edges: uniqueEdges,
              },
            };
          },
        })
    : undefined;

  return { loading, error, data: data?.products, fetchMore };
}; 
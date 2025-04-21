import { useQuery, ApolloError } from '@apollo/client';
import { GET_ORDERS_QUERY } from '../queries/getOrders';
import { GetOrdersData, GetOrdersVars, PageInfo, OrderEdge } from '../types/orders';
import { useMemo } from 'react';

interface UseOrdersResult {
  loading: boolean;
  error?: ApolloError | Error;
  data?: {
    edges: OrderEdge[];
    pageInfo: PageInfo;
  };
  fetchMore?: () => Promise<any>;
}

function generateDateQuery(startDate?: string, endDate?: string): string | null {
  let dateQueryParts: string[] = [];
  if (startDate) {
    dateQueryParts.push(`processed_at:>=${startDate}`);
  }
  if (endDate) {
    dateQueryParts.push(`processed_at:<=${endDate}`);
  }
  return dateQueryParts.length > 0 ? dateQueryParts.join(' AND ') : null;
}

export const useOrders = (inputVariables: GetOrdersVars): UseOrdersResult => {
  const queryString = useMemo(() => 
    generateDateQuery(inputVariables.startDate, inputVariables.endDate),
    [inputVariables.startDate, inputVariables.endDate]
  );

  const apolloVariables = useMemo(() => ({
    first: inputVariables.first,
    after: inputVariables.after,
    query: queryString,
  }), [inputVariables.first, inputVariables.after, queryString]);

  const { loading, error, data, fetchMore: apolloFetchMore } = useQuery<GetOrdersData, { first: number; after?: string | null; query?: string | null }>(
    GET_ORDERS_QUERY,
    {
      variables: apolloVariables,
      notifyOnNetworkStatusChange: true,
    }
  );

  if (error) {
    console.error("Error fetching orders:", error);
  }

  const fetchMore = apolloFetchMore && data?.orders.pageInfo.hasNextPage
    ? () =>
        apolloFetchMore({
          variables: {
            ...apolloVariables,
            after: data?.orders.pageInfo.endCursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            if (!prev.orders || !fetchMoreResult.orders) return prev;

            const newEdges = fetchMoreResult.orders.edges;
            const prevEdges = prev.orders.edges;
            const combinedEdges = [...prevEdges, ...newEdges];
            const uniqueEdges = Array.from(new Map(combinedEdges.map(edge => [edge.cursor, edge])).values());

            return {
              orders: {
                ...fetchMoreResult.orders,
                edges: uniqueEdges,
              },
            };
          },
        })
    : undefined;

  return { loading, error, data: data?.orders, fetchMore };
}; 
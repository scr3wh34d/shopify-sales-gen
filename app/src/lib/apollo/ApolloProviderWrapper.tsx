"use client"; // ApolloProvider needs to be a Client Component

import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "./client"; // Import the configured client

export function ApolloProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
} 
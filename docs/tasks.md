## Development Tasks

### Phase 1: Setup & Authentication (Week 1)

1. ~~Initialize Next.js project with TypeScript and Tailwind CSS~~
2. ~~Set up environment variables for Shopify API credentials~~
3. ~~Implement Shopify OAuth flow~~ *(Refinement needed: state/token storage)*
4. ~~Create middleware for protected routes~~ *(Refinement needed: session validation)*
5. ~~Set up basic layout and navigation~~


### Phase 2: Data Fetching & Models (Week 2)

1. ~~Create GraphQL queries for product data~~
2. ~~Implement data fetching utilities with proper error handling~~ *(Client hook created; server utility may be needed)*
3. ~~Define TypeScript interfaces for Shopify data models~~
4. ~~Set up data transformation utilities for analytics~~
5. ~~Implement caching strategy for API responses~~ *(Apollo InMemoryCache active; fetch policies/revalidation TBD)*


### Phase 3: Dashboard & Analytics (Week 3)

1. ~~Build dashboard layout with key metrics~~
2. ~~Implement product sales analysis components~~
3. ~~Create charts for 30/60/90 day comparisons~~
4. ~~Build inventory status components~~
5. ~~Implement filtering and search functionality~~ *(Basic date filter added to sales chart)*


### Phase 4: Reporting & Optimization (Week 4)

1. ~~Create export functionality for reports~~ *(CSV export added for product sales)*
2. Implement scheduled report generation *(Deferred)*
3. ~~Optimize data fetching with pagination~~ *(Implemented fetchMore in hooks and UI)*
4. ~~Add responsive design improvements~~ *(Reviewed layout, adjusted date picker wrap)*
5. ~~Implement error boundaries and fallbacks~~ *(Added global error.tsx and client ErrorBoundary)*

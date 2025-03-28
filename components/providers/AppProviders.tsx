"use client";
import { ThemeProvider } from "next-themes";
import { ReactNode, useState, Suspense } from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import NextTopLoader from "nextjs-toploader";
import dynamic from 'next/dynamic';

const ReactQueryDevtools = dynamic(
  () => 
    process.env.NODE_ENV === 'development'
      ? import('@tanstack/react-query-devtools').then((d) => d.ReactQueryDevtools)
      : Promise.resolve(() => null),
  {
    ssr: false,
  }
);

const AppProviders = ({ children }: { children: ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <NextTopLoader color="#10b981" showSpinner={false} />
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
      <Suspense fallback={null}>
        <ReactQueryDevtools />
      </Suspense>
    </QueryClientProvider>
  );
};

export default AppProviders;

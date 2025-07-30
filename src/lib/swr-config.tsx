"use client";

import { SWRConfig } from "swr";
import { ReactNode } from "react";

interface SWRProviderProps {
  children: ReactNode;
}

/**
 * SWRProvider is a component that provides a SWR configuration to the application.
 * It is used to configure the SWR library to not revalidate on focus, reconnect, or if stale.
 * It is also used to set the refresh interval to 0, the deduping interval to 60000,
 * the error retry count to 1, the error retry interval to 5000, and the should retry on error to false.
 * @param children - The children of the SWRProvider component.
 * @returns A SWRProvider component.
 */
export default function SWRProvider({ children }: SWRProviderProps) {
  return (
    <SWRConfig
      value={{
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
        revalidateIfStale: false,
        refreshInterval: 0,
        dedupingInterval: 60000,
        errorRetryCount: 1,
        errorRetryInterval: 5000,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}

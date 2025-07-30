"use client";

import { Card, CardContent } from "@/src/components/ui/card";
import { Skeleton } from "@/src/components/ui/skeleton";

/**
 * Compposant de skeleton for rider detail screen
 * @returns The skeleton
 */
export const RiderDetailSkeleton = () => (
  <div>
    <div className="bg-white p-4 flex justify-between items-center">
      <Skeleton className="h-6 w-20" />
      <Skeleton className="h-8 w-8" />
    </div>

    <Skeleton className="w-full h-48" />

    <Card className="m-4 -mt-16 relative z-10">
      <CardContent className="p-4">
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <Skeleton className="w-20 h-20 rounded-full" />
            <div>
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-8 w-8" />
        </div>

        <Skeleton className="h-16 w-full mt-4" />

        <div className="mt-4 flex space-x-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 m-4">
      <Skeleton className="h-80" />
      <Skeleton className="h-80" />
    </div>
  </div>
);

"use client";

import { useGetRiderBySlug } from "@/src/entities/riders/riders.hook";
import DetailRiderScreen from "@/src/components/screens/detail-rider-screen";
import { use } from "react";

interface DetailRiderProps {
  params: Promise<{ slug: string }>;
}

export default function DetailRider({ params }: DetailRiderProps) {
  const { slug } = use(params);
  const { data: rider, error, isLoading, mutate } = useGetRiderBySlug(slug);

  console.log("🔍 Rider:", rider);

  return (
    <DetailRiderScreen
      rider={rider}
      isLoading={isLoading}
      error={error}
      onRetry={() => mutate()}
    />
  );
}

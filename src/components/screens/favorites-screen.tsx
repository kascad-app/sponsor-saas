"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { DataTableWidget } from "@/src/widgets/data-table-sponsor";
import { Rider, riders } from "@/src/lib/dashboard.lib";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { useFavorites } from "@/src/contexts/favorites-context";
import {
  Filters,
  useFilters,
  sports,
  statuses,
} from "@/src/components/utils/filters-datatable";

// Define the columns for the DataTable
const columns: ColumnDef<Rider>[] = [
  {
    accessorKey: "photo",
    header: "",
    cell: ({ row }) => (
      <Avatar className="w-10 h-10">
        <AvatarFallback>
          {row.original.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2)}
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    accessorKey: "name",
    header: "Rider",
  },
  {
    accessorKey: "sport",
    header: "Sport",
    cell: ({ row }) => (
      <Badge variant="outline" className="font-normal">
        {row.original.sport}
      </Badge>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => {
      const level = row.original.level;
      return (
        <Badge
          className={
            level === "professional"
              ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
              : level === "advanced"
              ? "bg-green-100 text-green-800 hover:bg-green-100"
              : level === "intermediate"
              ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
          }
        >
          {level.charAt(0).toUpperCase() + level.slice(1)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge
        variant={row.original.status === "active" ? "default" : "secondary"}
      >
        {row.original.status === "active" ? "Active" : "Inactive"}
      </Badge>
    ),
  },
  {
    accessorKey: "joinedDate",
    header: "Joined",
    cell: ({ row }) => {
      const date = new Date(row.original.joinedDate);
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
];

export const FavoritesScreen = () => {
  const { favorites } = useFavorites();
  const {
    searchQuery,
    setSearchQuery,
    selectedSport,
    setSelectedSport,
    selectedStatus,
    setSelectedStatus,
    hasAnyFilter,
    resetFilters,
  } = useFilters();

  // Filter the riders based on search query, selected filters, and favorites
  const filteredRiders = riders.filter((rider) => {
    if (!favorites.includes(rider.id)) return false;

    const matchesSearch = rider.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSport =
      selectedSport === "All Sports" || rider.sport === selectedSport;
    const matchesStatus =
      selectedStatus === "All Statuses" ||
      (selectedStatus === "Active" && rider.status === "active") ||
      (selectedStatus === "Inactive" && rider.status === "inactive");

    return matchesSearch && matchesSport && matchesStatus;
  });

  return (
    <div className="grid min-h-screen w-full relative">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">
              Tous vos riders favoris
            </h1>
            <div className="relative w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un rider..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <Filters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSport={selectedSport}
            setSelectedSport={setSelectedSport}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            showSearch={false}
            sportOptions={sports}
            statusOptions={statuses}
            hasAnyFilter={hasAnyFilter}
            resetFilters={resetFilters}
          />

          <DataTableWidget columns={columns} data={filteredRiders} />
        </main>
      </div>
    </div>
  );
};

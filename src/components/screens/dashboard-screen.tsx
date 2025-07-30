"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { DataTableWidget } from "@/src/widget/data-table/data-table-sponsor";
import { Rider, riders } from "@/src/lib/dashboard.lib";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import {
  FilterDrawer,
  genres,
  sports,
  countries,
  languages,
} from "@/src/components/utils/filters-datatable";
import { useDashboardFilters } from "@/src/components/utils/use-dashboard-filters";

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

export const RidersDashboard = () => {
  const {
    searchQuery,
    setSearchQuery,
    // selectedGenre,
    selectedSport,
    // selectedCountry,
    // selectedLanguage,
    tempGenre,
    setTempGenre,
    tempSport,
    setTempSport,
    tempCountry,
    setTempCountry,
    tempLanguage,
    setTempLanguage,
    hasAnyFilter,
    resetFilters,
    applyFilters,
  } = useDashboardFilters();

  const filteredRiders = riders.filter((rider) => {
    const matchesSearch = rider.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesSport =
      selectedSport === "Tous les sports" || rider.sport === selectedSport;

    return matchesSearch && matchesSport;
  });

  return (
    <div className="grid min-h-screen w-full relative">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">
              Tous les riders
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

          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <Card className="w-full md:w-1/4">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">
                  Total Riders
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{riders.length}</div>
                <p className="text-xs text-muted-foreground">
                  {riders.filter((r) => r.status === "active").length} active
                  riders
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-wrap gap-2 justify-end w-full">
              <FilterDrawer
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedGenres={[tempGenre].filter(
                  (g) => g !== "Tous les genres",
                )}
                setSelectedGenres={(genres) =>
                  setTempGenre(genres[0] || "Tous les genres")
                }
                selectedSports={[tempSport].filter(
                  (s) => s !== "Tous les sports",
                )}
                setSelectedSports={(sports) =>
                  setTempSport(sports[0] || "Tous les sports")
                }
                selectedCountries={[tempCountry].filter(
                  (c) => c !== "Tous les pays",
                )}
                setSelectedCountries={(countries) =>
                  setTempCountry(countries[0] || "Tous les pays")
                }
                selectedLanguages={[tempLanguage].filter(
                  (l) => l !== "Toutes les langues",
                )}
                setSelectedLanguages={(languages) =>
                  setTempLanguage(languages[0] || "Toutes les langues")
                }
                genreOptions={genres}
                sportOptions={sports}
                countryOptions={countries}
                languageOptions={languages}
                hasAnyFilter={hasAnyFilter}
                resetFilters={resetFilters}
                applyFilters={applyFilters}
              />
            </div>
          </div>

          <DataTableWidget columns={columns} data={filteredRiders} />
        </main>
      </div>
    </div>
  );
};

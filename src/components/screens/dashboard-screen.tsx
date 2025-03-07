"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Check, ChevronDown, Filter } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { DataTableWidget } from "@/src/widgets/data-table-sponsor";
import { Rider, riders } from "@/src/lib/dashboard.lib";

// Define the columns for the DataTable
const columns: ColumnDef<Rider>[] = [
  {
    accessorKey: "photo",
    header: "",
    cell: ({ row }) => (
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <Image
          src={row.original.photo || "/placeholder.svg"}
          alt={row.original.name}
          width={40}
          height={40}
          className="object-cover"
        />
      </div>
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

// Available sports for filtering
const sports = ["All Sports", "Mountain Biking", "Road Cycling", "BMX"];
const statuses = ["All Statuses", "Active", "Inactive"];

export const RidersDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("All Sports");
  const [selectedStatus, setSelectedStatus] = useState("All Statuses");

  // Filter the riders based on search query and selected filters
  const filteredRiders = riders.filter((rider) => {
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
    <div className="grid min-h-screen w-full">
      <div className="flex flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">
              Tous les riders
            </h1>
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Sport: {selectedSport}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search sport..." />
                    <CommandList>
                      <CommandEmpty>No sport found.</CommandEmpty>
                      <CommandGroup>
                        {sports.map((sport) => (
                          <CommandItem
                            key={sport}
                            onSelect={() => setSelectedSport(sport)}
                            className="flex items-center gap-2"
                          >
                            {selectedSport === sport && (
                              <Check className="h-4 w-4" />
                            )}
                            <span
                              className={
                                selectedSport === sport ? "font-medium" : ""
                              }
                            >
                              {sport}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Status: {selectedStatus}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search status..." />
                    <CommandList>
                      <CommandEmpty>No status found.</CommandEmpty>
                      <CommandGroup>
                        {statuses.map((status) => (
                          <CommandItem
                            key={status}
                            onSelect={() => setSelectedStatus(status)}
                            className="flex items-center gap-2"
                          >
                            {selectedStatus === status && (
                              <Check className="h-4 w-4" />
                            )}
                            <span
                              className={
                                selectedStatus === status ? "font-medium" : ""
                              }
                            >
                              {status}
                            </span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {(selectedSport !== "All Sports" ||
                selectedStatus !== "All Statuses" ||
                searchQuery) && (
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedSport("All Sports");
                    setSelectedStatus("All Statuses");
                    setSearchQuery("");
                  }}
                >
                  Reset Filters
                </Button>
              )}
            </div>
          </div>

          <DataTableWidget columns={columns} data={filteredRiders} />
        </main>
      </div>
    </div>
  );
};

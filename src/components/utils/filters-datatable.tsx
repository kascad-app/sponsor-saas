"use client";

import { useState } from "react";
import { Check, ChevronDown, Filter, Search } from "lucide-react";
import { Button } from "@/src/components/ui/button";
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
import { Input } from "@/src/components/ui/input";

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedSport: string;
  setSelectedSport: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  showSearch?: boolean;
  sportOptions: string[];
  statusOptions: string[];
  additionalFilters?: React.ReactNode;
  hasAnyFilter: boolean;
  resetFilters: () => void;
}

export const Filters = ({
  searchQuery,
  setSearchQuery,
  selectedSport,
  setSelectedSport,
  selectedStatus,
  setSelectedStatus,
  showSearch = true,
  sportOptions,
  statusOptions,
  additionalFilters,
  hasAnyFilter,
  resetFilters,
}: FiltersProps) => {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      {showSearch && (
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un rider..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      )}

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
                  {sportOptions.map((sport) => (
                    <CommandItem
                      key={sport}
                      onSelect={() => setSelectedSport(sport)}
                      className="flex items-center gap-2"
                    >
                      {selectedSport === sport && <Check className="h-4 w-4" />}
                      <span
                        className={selectedSport === sport ? "font-medium" : ""}
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
                  {statusOptions.map((status) => (
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

        {additionalFilters}

        {hasAnyFilter && (
          <Button variant="ghost" onClick={resetFilters}>
            Reset Filters
          </Button>
        )}
      </div>
    </div>
  );
};

export const useFilters = (
  initialSport = "All Sports",
  initialStatus = "All Statuses",
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState(initialSport);
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedSport(initialSport);
    setSelectedStatus(initialStatus);
  };

  const hasAnyFilter =
    searchQuery !== "" ||
    selectedSport !== initialSport ||
    selectedStatus !== initialStatus;

  return {
    searchQuery,
    setSearchQuery,
    selectedSport,
    setSelectedSport,
    selectedStatus,
    setSelectedStatus,
    resetFilters,
    hasAnyFilter,
  };
};

// Common filter options
export const sports = ["All Sports", "Mountain Biking", "Road Cycling", "BMX"];
export const statuses = ["All Statuses", "Active", "Inactive"];

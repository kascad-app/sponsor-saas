"use client";

import { useState } from "react";
import { Check, ChevronDown, Filter, Search, X } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Label } from "@/src/components/ui/label";
import { Badge } from "@/src/components/ui/badge";

// TODO déplacer et typer
interface FilterDrawerProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedGenres: string[];
  setSelectedGenres: (value: string[]) => void;
  selectedSports: string[];
  setSelectedSports: (value: string[]) => void;
  selectedCountries: string[];
  setSelectedCountries: (value: string[]) => void;
  selectedLanguages: string[];
  setSelectedLanguages: (value: string[]) => void;
  genreOptions: string[];
  sportOptions: string[];
  countryOptions: string[];
  languageOptions: string[];
  hasAnyFilter: boolean;
  resetFilters: () => void;
  applyFilters: () => void;
}

export const FilterDrawer = ({
  searchQuery,
  setSearchQuery,
  selectedGenres,
  setSelectedGenres,
  selectedSports,
  setSelectedSports,
  selectedCountries,
  setSelectedCountries,
  selectedLanguages,
  setSelectedLanguages,
  genreOptions,
  sportOptions,
  countryOptions,
  languageOptions,
  hasAnyFilter,
  resetFilters,
  applyFilters,
}: FilterDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleApply = () => {
    applyFilters();
    setIsOpen(false);
  };

  const handleReset = () => {
    resetFilters();
  };

  const MultiFilterSelect = ({
    label,
    selectedValues,
    options,
    onSelect,
    placeholder,
  }: {
    label: string;
    selectedValues: string[];
    options: string[];
    onSelect: (values: string[]) => void;
    placeholder: string;
  }) => {
    const handleSelect = (option: string) => {
      if (option === options[0]) {
        // "Tous les..." option
        if (selectedValues.includes(option)) {
          onSelect([]);
        } else {
          onSelect([option]);
        }
      } else {
        const newValues = selectedValues.includes(option)
          ? selectedValues.filter((v) => v !== option && v !== options[0])
          : [...selectedValues.filter((v) => v !== options[0]), option];
        onSelect(newValues);
      }
    };

    const displayText =
      selectedValues.length === 0 || selectedValues.includes(options[0])
        ? options[0]
        : selectedValues.length === 1
        ? selectedValues[0]
        : `${selectedValues.length} sélectionnés`;

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between"
              role="combobox"
            >
              {displayText}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput placeholder={placeholder} />
              <CommandList>
                <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                <CommandGroup>
                  {options.map((option) => {
                    const isSelected = selectedValues.includes(option);
                    const isAllOption = option === options[0];

                    return (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => handleSelect(option)}
                      >
                        <Check
                          className={`mr-2 h-4 w-4 ${
                            isSelected ? "opacity-100" : "opacity-0"
                          }`}
                        />
                        {option}
                        {isAllOption && isSelected && (
                          <span className="ml-auto text-xs text-muted-foreground">
                            (défaut)
                          </span>
                        )}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Show selected items as badges (except for "Tous les..." option) */}
        {selectedValues.length > 0 && !selectedValues.includes(options[0]) && (
          <div className="flex flex-wrap gap-1 mt-2">
            {selectedValues.map((value) => (
              <Badge key={value} variant="secondary" className="text-xs">
                {value}
                <button
                  onClick={() => handleSelect(value)}
                  className="ml-1 hover:bg-secondary-foreground/20 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  };

  const totalActiveFilters = [
    selectedGenres.length > 0 && !selectedGenres.includes("Tous les genres"),
    selectedSports.length > 0 && !selectedSports.includes("Tous les sports"),
    selectedCountries.length > 0 &&
      !selectedCountries.includes("Tous les pays"),
    selectedLanguages.length > 0 &&
      !selectedLanguages.includes("Toutes les langues"),
    searchQuery !== "",
  ].filter(Boolean).length;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtres
          {hasAnyFilter && (
            <span className="ml-1 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
              {totalActiveFilters}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filtres</SheetTitle>
          <SheetDescription>
            Affinez votre recherche avec les filtres ci-dessous.
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 py-6">
          <MultiFilterSelect
            label="Genre"
            selectedValues={selectedGenres}
            options={genreOptions}
            onSelect={setSelectedGenres}
            placeholder="Rechercher un genre..."
          />

          <MultiFilterSelect
            label="Sport"
            selectedValues={selectedSports}
            options={sportOptions}
            onSelect={setSelectedSports}
            placeholder="Rechercher un sport..."
          />

          <MultiFilterSelect
            label="Pays"
            selectedValues={selectedCountries}
            options={countryOptions}
            onSelect={setSelectedCountries}
            placeholder="Rechercher un pays..."
          />

          <MultiFilterSelect
            label="Langue"
            selectedValues={selectedLanguages}
            options={languageOptions}
            onSelect={setSelectedLanguages}
            placeholder="Rechercher une langue..."
          />
        </div>

        <SheetFooter className="gap-2">
          <Button variant="outline" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button onClick={handleApply}>Appliquer</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const useFilters = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenres, setSelectedGenres] = useState<string[]>([
    "Tous les genres",
  ]);
  const [selectedSports, setSelectedSports] = useState<string[]>([
    "Tous les sports",
  ]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([
    "Tous les pays",
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([
    "Toutes les langues",
  ]);

  // États temporaires pour le drawer (avant application)
  const [tempGenres, setTempGenres] = useState<string[]>(["Tous les genres"]);
  const [tempSports, setTempSports] = useState<string[]>(["Tous les sports"]);
  const [tempCountries, setTempCountries] = useState<string[]>([
    "Tous les pays",
  ]);
  const [tempLanguages, setTempLanguages] = useState<string[]>([
    "Toutes les langues",
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenres(["Tous les genres"]);
    setSelectedSports(["Tous les sports"]);
    setSelectedCountries(["Tous les pays"]);
    setSelectedLanguages(["Toutes les langues"]);
    setTempGenres(["Tous les genres"]);
    setTempSports(["Tous les sports"]);
    setTempCountries(["Tous les pays"]);
    setTempLanguages(["Toutes les langues"]);
  };

  const applyFilters = () => {
    setSelectedGenres(tempGenres);
    setSelectedSports(tempSports);
    setSelectedCountries(tempCountries);
    setSelectedLanguages(tempLanguages);
  };

  const hasAnyFilter =
    searchQuery !== "" ||
    (selectedGenres.length > 0 &&
      !selectedGenres.includes("Tous les genres")) ||
    (selectedSports.length > 0 &&
      !selectedSports.includes("Tous les sports")) ||
    (selectedCountries.length > 0 &&
      !selectedCountries.includes("Tous les pays")) ||
    (selectedLanguages.length > 0 &&
      !selectedLanguages.includes("Toutes les langues"));

  return {
    searchQuery,
    setSearchQuery,
    // Valeurs appliquées (pour le filtrage)
    selectedGenres,
    selectedSports,
    selectedCountries,
    selectedLanguages,
    // Valeurs temporaires (pour le drawer)
    tempGenres,
    setTempGenres,
    tempSports,
    setTempSports,
    tempCountries,
    setTempCountries,
    tempLanguages,
    setTempLanguages,
    resetFilters,
    applyFilters,
    hasAnyFilter,
    // Helper functions for URL sync
    setSelectedGenres,
    setSelectedSports,
    setSelectedCountries,
    setSelectedLanguages,
  };
};

// Options de filtres
// TODO déplacer type global
export const genres = ["Tous les genres", "Homme", "Femme", "Non-binaire"];
export const sports = [
  "Tous les sports",
  "Mountain Biking",
  "Road Cycling",
  "BMX",
  "Skateboard",
  "Surf",
];
export const countries = [
  "Tous les pays",
  "France",
  "États-Unis",
  "Canada",
  "Allemagne",
  "Espagne",
  "Italie",
];
export const languages = [
  "Toutes les langues",
  "Français",
  "Anglais",
  "Espagnol",
  "Allemand",
  "Italien",
];

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedSport: string;
  setSelectedSport: (value: string) => void;
  selectedStatus?: string;
  setSelectedStatus?: (value: string) => void;
  showSearch?: boolean;
  sportOptions: string[];
  statusOptions?: string[];
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
  statusOptions = [],
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

        {selectedStatus && setSelectedStatus && statusOptions.length > 0 && (
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
        )}

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

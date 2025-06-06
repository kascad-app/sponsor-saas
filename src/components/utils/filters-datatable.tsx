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

interface FilterDrawerProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  selectedGenre: string;
  setSelectedGenre: (value: string) => void;
  selectedSport: string;
  setSelectedSport: (value: string) => void;
  selectedCountry: string;
  setSelectedCountry: (value: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
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
  selectedGenre,
  setSelectedGenre,
  selectedSport,
  setSelectedSport,
  selectedCountry,
  setSelectedCountry,
  selectedLanguage,
  setSelectedLanguage,
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

  const FilterSelect = ({
    label,
    value,
    options,
    onSelect,
    placeholder,
  }: {
    label: string;
    value: string;
    options: string[];
    onSelect: (value: string) => void;
    placeholder: string;
  }) => (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between"
            role="combobox"
          >
            {value}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput placeholder={placeholder} />
            <CommandList>
              <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => (
                  <CommandItem
                    key={option}
                    value={option}
                    onSelect={() => onSelect(option)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        value === option ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    {option}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filtres
          {hasAnyFilter && (
            <span className="ml-1 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
              {
                [
                  selectedGenre !== "Tous les genres",
                  selectedSport !== "Tous les sports",
                  selectedCountry !== "Tous les pays",
                  selectedLanguage !== "Toutes les langues",
                  searchQuery !== "",
                ].filter(Boolean).length
              }
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
          <FilterSelect
            label="Genre"
            value={selectedGenre}
            options={genreOptions}
            onSelect={setSelectedGenre}
            placeholder="Rechercher un genre..."
          />

          <FilterSelect
            label="Sport"
            value={selectedSport}
            options={sportOptions}
            onSelect={setSelectedSport}
            placeholder="Rechercher un sport..."
          />

          <FilterSelect
            label="Pays"
            value={selectedCountry}
            options={countryOptions}
            onSelect={setSelectedCountry}
            placeholder="Rechercher un pays..."
          />

          <FilterSelect
            label="Langue"
            value={selectedLanguage}
            options={languageOptions}
            onSelect={setSelectedLanguage}
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

export const useFilters = (
  initialGenre = "Tous les genres",
  initialSport = "Tous les sports",
  initialCountry = "Tous les pays",
  initialLanguage = "Toutes les langues",
) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedSport, setSelectedSport] = useState(initialSport);
  const [selectedCountry, setSelectedCountry] = useState(initialCountry);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);

  // États temporaires pour le drawer (avant application)
  const [tempGenre, setTempGenre] = useState(initialGenre);
  const [tempSport, setTempSport] = useState(initialSport);
  const [tempCountry, setTempCountry] = useState(initialCountry);
  const [tempLanguage, setTempLanguage] = useState(initialLanguage);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenre(initialGenre);
    setSelectedSport(initialSport);
    setSelectedCountry(initialCountry);
    setSelectedLanguage(initialLanguage);
    setTempGenre(initialGenre);
    setTempSport(initialSport);
    setTempCountry(initialCountry);
    setTempLanguage(initialLanguage);
  };

  const applyFilters = () => {
    setSelectedGenre(tempGenre);
    setSelectedSport(tempSport);
    setSelectedCountry(tempCountry);
    setSelectedLanguage(tempLanguage);
  };

  const hasAnyFilter =
    searchQuery !== "" ||
    selectedGenre !== initialGenre ||
    selectedSport !== initialSport ||
    selectedCountry !== initialCountry ||
    selectedLanguage !== initialLanguage;

  return {
    searchQuery,
    setSearchQuery,
    // Valeurs appliquées (pour le filtrage)
    selectedGenre,
    selectedSport,
    selectedCountry,
    selectedLanguage,
    // Valeurs temporaires (pour le drawer)
    tempGenre,
    setTempGenre,
    tempSport,
    setTempSport,
    tempCountry,
    setTempCountry,
    tempLanguage,
    setTempLanguage,
    resetFilters,
    applyFilters,
    hasAnyFilter,
  };
};

// Options de filtres
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

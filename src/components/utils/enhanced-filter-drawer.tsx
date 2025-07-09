"use client";

import { useState, forwardRef, useImperativeHandle } from "react";
import {
  Check,
  ChevronDown,
  Filter,
  X,
  Save,
  Trash2,
  Clock,
} from "lucide-react";
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
import { Switch } from "@/src/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  SearchFilters,
  SavedSearch,
  FILTER_OPTIONS,
} from "@/src/entities/scouting/scouting.types";
import { toast } from "sonner";

interface EnhancedFilterDrawerProps {
  filters: SearchFilters;
  tempFilters: SearchFilters;
  updateTempFilter: <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => void;
  setTempFilters: (filters: SearchFilters) => void;
  hasActiveFilters: boolean;
  resetFilters: () => void;
  applyFilters: () => void;
  filterOptions: typeof FILTER_OPTIONS;
  savedSearches: SavedSearch[];
  saveCurrentSearch: (name: string) => Promise<void>;
  loadSavedSearch: (savedSearch: SavedSearch) => void;
  deleteSavedSearchById: (searchId: string) => Promise<void>;
  isCreatingSavedSearch: boolean;
}

export interface EnhancedFilterDrawerRef {
  openDrawer: () => void;
}

// TODO clean le fichier et le rendre plus modulaire + faire delete et update ?
// TODO clean le template
export const EnhancedFilterDrawer = forwardRef<
  EnhancedFilterDrawerRef,
  EnhancedFilterDrawerProps
>(
  (
    {
      // filters,
      tempFilters,
      updateTempFilter,
      // setTempFilters,
      hasActiveFilters,
      resetFilters,
      applyFilters,
      filterOptions,
      savedSearches,
      saveCurrentSearch,
      loadSavedSearch,
      deleteSavedSearchById,
      isCreatingSavedSearch,
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [saveDialogOpen, setSaveDialogOpen] = useState(false);
    const [searchName, setSearchName] = useState("");

    // Expose openDrawer function to parent
    useImperativeHandle(ref, () => ({
      openDrawer: () => setIsOpen(true),
    }));

    const handleApply = () => {
      applyFilters();
      setIsOpen(false);
    };

    const handleReset = () => {
      resetFilters();
    };

    const handleSaveSearch = async () => {
      if (searchName.trim()) {
        try {
          await saveCurrentSearch(searchName.trim());
          setSaveDialogOpen(false);
          setSearchName("");
        } catch (error) {
          console.error(error);
        }
      } else {
        toast.error("Veuillez entrer un nom pour la recherche");
      }
    };

    const MultiFilterSelect = ({
      label,
      selectedValues = [],
      options,
      onSelect,
      placeholder,
    }: {
      label: string;
      selectedValues: string[];
      options: readonly string[];
      onSelect: (values: string[]) => void;
      placeholder: string;
    }) => {
      const handleSelect = (option: string) => {
        const newValues = selectedValues.includes(option)
          ? selectedValues.filter((v) => v !== option)
          : [...selectedValues, option];
        onSelect(newValues);
      };

      const displayText =
        selectedValues.length === 0
          ? `Sélectionner ${label.toLowerCase()}`
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
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedValues.length > 0 && (
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

    const BooleanFilter = ({
      label,
      value,
      onSelect,
      description,
    }: {
      label: string;
      value?: boolean;
      onSelect: (value: boolean | undefined) => void;
      description?: string;
    }) => (
      <div className="space-y-2">
        <Label className="text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        <div className="flex items-center space-x-2">
          <Switch
            checked={value === true}
            onCheckedChange={(checked) => onSelect(checked ? true : undefined)}
          />
          <span className="text-sm">
            {value === true ? "Oui" : value === false ? "Non" : "Indifférent"}
          </span>
        </div>
      </div>
    );

    const DateRangeFilter = () => (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Âge (18 ans minimum)</Label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-muted-foreground">Date min</Label>
            <Input
              type="date"
              value={tempFilters.maxBirthdate || ""}
              onChange={(e) => updateTempFilter("maxBirthdate", e.target.value)}
              max={
                new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]
              }
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Date max</Label>
            <Input
              type="date"
              value={tempFilters.minBirthdate || ""}
              onChange={(e) => updateTempFilter("minBirthdate", e.target.value)}
              max={
                new Date(Date.now() - 18 * 365 * 24 * 60 * 60 * 1000)
                  .toISOString()
                  .split("T")[0]
              }
            />
          </div>
        </div>
      </div>
    );

    const activeFiltersCount = Object.values(tempFilters).filter((value) => {
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "boolean") return value !== undefined;
      if (typeof value === "string") return value !== "";
      return false;
    }).length;

    return (
      <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filtres
              {hasActiveFilters && (
                <span className="ml-1 rounded-full bg-primary px-2 py-1 text-xs text-primary-foreground">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filtres de recherche</SheetTitle>
              <SheetDescription>
                Affinez votre recherche avec les filtres ci-dessous.
              </SheetDescription>
            </SheetHeader>

            <div className="grid gap-6 py-6">
              {/* Recherches sauvegardées */}
              {savedSearches.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Recherches sauvegardées
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {savedSearches.map((search, index) => {
                      if (!search.id) {
                        console.warn("Search object missing ID:", search);
                        return null;
                      }

                      return (
                        <div
                          key={`${search.id}-${index}`}
                          className="flex items-center justify-between p-2 rounded border"
                        >
                          <button
                            onClick={() => {
                              loadSavedSearch(search);
                              setIsOpen(false);
                            }}
                            className="flex-1 text-left text-sm hover:bg-muted p-1 rounded"
                          >
                            {search.name}
                          </button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={async () => {
                              if (search.id && search.id !== "undefined") {
                                try {
                                  await deleteSavedSearchById(search.id);
                                } catch (error) {
                                  console.error(error);
                                }
                              } else {
                                toast.error("ID de recherche invalide");
                              }
                            }}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>
              )}

              {/* TODO faire un .map sur un tab dans un .lib */}
              {/* Filtres multi-sélection */}
              <MultiFilterSelect
                label="Sports"
                selectedValues={tempFilters.sports || []}
                options={filterOptions.sports}
                onSelect={(values) => updateTempFilter("sports", values)}
                placeholder="Rechercher un sport..."
              />

              <MultiFilterSelect
                label="Pays"
                selectedValues={tempFilters.countries || []}
                options={filterOptions.countries}
                onSelect={(values) => updateTempFilter("countries", values)}
                placeholder="Rechercher un pays..."
              />

              <MultiFilterSelect
                label="Genre"
                selectedValues={tempFilters.gender || []}
                options={filterOptions.gender}
                onSelect={(values) => updateTempFilter("gender", values)}
                placeholder="Rechercher un genre..."
              />

              <MultiFilterSelect
                label="Langues parlées"
                selectedValues={tempFilters.languages || []}
                options={filterOptions.languages}
                onSelect={(values) => updateTempFilter("languages", values)}
                placeholder="Rechercher une langue..."
              />

              <MultiFilterSelect
                label="Réseaux sociaux"
                selectedValues={tempFilters.socials || []}
                options={filterOptions.socials}
                onSelect={(values) => updateTempFilter("socials", values)}
                placeholder="Rechercher un réseau..."
              />

              <MultiFilterSelect
                label="Type de contrat"
                selectedValues={tempFilters.contractType || []}
                options={filterOptions.contractType}
                onSelect={(values) => updateTempFilter("contractType", values)}
                placeholder="Rechercher un type..."
              />

              {/* Filtre de date */}
              <DateRangeFilter />

              {/* Filtres booléens */}
              <BooleanFilter
                label="Déjà été sponsorisé"
                value={tempFilters.isBeenSponsored}
                onSelect={(value) => updateTempFilter("isBeenSponsored", value)}
                description="Le rider a-t-il déjà été sponsorisé ?"
              />

              <BooleanFilter
                label="Disponible"
                value={tempFilters.isDisponible}
                onSelect={(value) => updateTempFilter("isDisponible", value)}
                description="Le rider est-il actuellement disponible ?"
              />
            </div>

            <SheetFooter className="gap-2 flex-start flex-wrap justify-between w-full">
              <Button variant="outline" onClick={handleReset}>
                Réinitialiser
              </Button>

              {hasActiveFilters && (
                <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Sauvegarder
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Sauvegarder la recherche</DialogTitle>
                      <DialogDescription>
                        Donnez un nom à cette recherche pour la retrouver
                        facilement.
                      </DialogDescription>
                    </DialogHeader>
                    <Input
                      placeholder="Nom de la recherche..."
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setSaveDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button
                        onClick={handleSaveSearch}
                        disabled={!searchName.trim() || isCreatingSavedSearch}
                      >
                        {isCreatingSavedSearch
                          ? "Sauvegarde..."
                          : "Sauvegarder"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}

              <Button onClick={handleApply}>Appliquer</Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </>
    );
  },
);

EnhancedFilterDrawer.displayName = "EnhancedFilterDrawer";

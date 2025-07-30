"use client";

import { useState } from "react";
import { Check, ChevronDown, X } from "lucide-react";
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
import { Badge } from "@/src/components/ui/badge";
import { FILTER_OPTIONS } from "@/src/entities/scouting/scouting.types";

interface MultiSportSelectProps {
  selectedSports: string[];
  onSportsChange: (sports: string[]) => void;
  disabled?: boolean;
}

export const MultiSportSelect = ({
  selectedSports,
  onSportsChange,
  disabled = false,
}: MultiSportSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (sport: string) => {
    if (selectedSports.includes(sport)) {
      onSportsChange(selectedSports.filter((s) => s !== sport));
    } else {
      onSportsChange([...selectedSports, sport]);
    }
  };

  const handleRemove = (sport: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onSportsChange(selectedSports.filter((s) => s !== sport));
  };

  return (
    <div className="space-y-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between min-h-[40px] h-auto"
            disabled={disabled}
          >
            <div className="flex flex-wrap gap-1 flex-1">
              {selectedSports.length === 0 ? (
                <span className="text-muted-foreground">
                  Sélectionnez des sports...
                </span>
              ) : (
                selectedSports.map((sport) => (
                  <Badge
                    key={sport}
                    variant="secondary"
                    className="text-xs"
                    onClick={(e) => handleRemove(sport, e)}
                  >
                    {sport}
                    <X className="ml-1 h-3 w-3 cursor-pointer" />
                  </Badge>
                ))
              )}
            </div>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Rechercher un sport..." />
            <CommandEmpty>Aucun sport trouvé.</CommandEmpty>
            <CommandList>
              <CommandGroup>
                {FILTER_OPTIONS.sports.map((sport) => (
                  <CommandItem
                    key={sport}
                    value={sport}
                    onSelect={() => handleSelect(sport)}
                  >
                    <Check
                      className={`mr-2 h-4 w-4 ${
                        selectedSports.includes(sport)
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    />
                    {sport}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Affichage des sports sélectionnés sous forme de badges (optionnel) */}
      {selectedSports.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedSports.map((sport) => (
            <Badge
              key={sport}
              variant="outline"
              className="text-xs cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => handleRemove(sport, {} as React.MouseEvent)}
            >
              {sport}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

import { SearchFilters } from "@/src/entities/scouting/scouting.types";

// Get active filters for display
export const getActiveFilters = (filters: SearchFilters) => {
  const active: string[] = [];

  if (filters.searchQuery) active.push(`"${filters.searchQuery}"`);
  if (filters.sports?.length) active.push(`${filters.sports.length} sport(s)`);
  if (filters.countries?.length)
    active.push(`${filters.countries.length} pays`);
  if (filters.gender?.length) active.push(`${filters.gender.length} genre(s)`);
  if (filters.languages?.length)
    active.push(`${filters.languages.length} langue(s)`);
  if (filters.socials?.length)
    active.push(`${filters.socials.length} réseau(x)`);
  if (filters.contractType?.length)
    active.push(`${filters.contractType.length} type(s) de contrat`);
  if (filters.isBeenSponsored !== undefined) active.push("sponsoring");
  if (filters.isDisponible !== undefined) active.push("disponibilité");
  if (filters.minBirthdate || filters.maxBirthdate) active.push("âge");

  return active;
};

// Filter riders based on search criteria
export const filterRiders = <
  T extends {
    name: string;
    sport: string;
    country?: string;
    gender?: string;
    languages?: string[];
    socials?: string[];
    contractType?: string;
    isBeenSponsored?: boolean;
    isDisponible?: boolean;
    birthdate?: string;
  },
>(
  riders: T[],
  filters: SearchFilters,
  hasActiveFilters: boolean,
): T[] => {
  if (!hasActiveFilters) {
    return [];
  }

  return riders.filter((rider) => {
    // Recherche par nom
    if (
      filters.searchQuery &&
      !rider.name.toLowerCase().includes(filters.searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Filtrage par sports
    if (
      filters.sports &&
      filters.sports.length > 0 &&
      !filters.sports.includes(rider.sport)
    ) {
      return false;
    }

    // Filtrage par pays
    if (
      filters.countries &&
      filters.countries.length > 0 &&
      rider.country &&
      !filters.countries.includes(rider.country)
    ) {
      return false;
    }

    // Filtrage par genre
    if (
      filters.gender &&
      filters.gender.length > 0 &&
      rider.gender &&
      !filters.gender.includes(rider.gender)
    ) {
      return false;
    }

    // Filtrage par langues parlées
    if (
      filters.languages &&
      filters.languages.length > 0 &&
      rider.languages &&
      !filters.languages.some((lang) => rider.languages?.includes(lang))
    ) {
      return false;
    }

    // Filtrage par réseaux sociaux
    if (
      filters.socials &&
      filters.socials.length > 0 &&
      rider.socials &&
      !filters.socials.some((social) => rider.socials?.includes(social))
    ) {
      return false;
    }

    // Filtrage par type de contrat
    if (
      filters.contractType &&
      filters.contractType.length > 0 &&
      rider.contractType &&
      !filters.contractType.includes(rider.contractType)
    ) {
      return false;
    }

    // Filtrage par statut de sponsoring
    if (
      filters.isBeenSponsored !== undefined &&
      rider.isBeenSponsored !== filters.isBeenSponsored
    ) {
      return false;
    }

    // Filtrage par disponibilité
    if (
      filters.isDisponible !== undefined &&
      rider.isDisponible !== filters.isDisponible
    ) {
      return false;
    }

    // Filtrage par âge (date de naissance)
    if (rider.birthdate) {
      const riderBirthDate = new Date(rider.birthdate);

      if (filters.minBirthdate) {
        const minDate = new Date(filters.minBirthdate);
        if (riderBirthDate < minDate) {
          return false;
        }
      }

      if (filters.maxBirthdate) {
        const maxDate = new Date(filters.maxBirthdate);
        if (riderBirthDate > maxDate) {
          return false;
        }
      }
    }

    return true;
  });
};

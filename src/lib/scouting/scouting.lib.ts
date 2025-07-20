import { SearchFilters } from "@/src/entities/scouting/scouting.types";
import { Rider } from "@kascad-app/shared-types";

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
export const filterRiders = (
  riders: Rider[],
  filters: SearchFilters,
  hasActiveFilters: boolean,
): Rider[] => {
  if (!hasActiveFilters) {
    return [];
  }

  return riders.filter((rider) => {
    // Recherche par nom (firstName + lastName)
    if (filters.searchQuery) {
      const fullName =
        `${rider.identity.firstName} ${rider.identity.lastName}`.toLowerCase();
      if (!fullName.includes(filters.searchQuery.toLowerCase())) {
        return false;
      }
    }

    // Filtrage par sports
    if (
      filters.sports &&
      filters.sports.length > 0 &&
      !filters.sports.some((sport) =>
        rider.preferences.sports.some(
          (riderSport) => riderSport.name === sport,
        ),
      )
    ) {
      return false;
    }

    // Filtrage par pays
    if (
      filters.countries &&
      filters.countries.length > 0 &&
      !filters.countries.includes(rider.identity.country)
    ) {
      return false;
    }

    // Filtrage par genre
    if (
      filters.gender &&
      filters.gender.length > 0 &&
      !filters.gender.includes(rider.identity.gender)
    ) {
      return false;
    }

    // Filtrage par langues parlées
    if (
      filters.languages &&
      filters.languages.length > 0 &&
      !filters.languages.some((lang) =>
        rider.identity.languageSpoken.includes(lang),
      )
    ) {
      return false;
    }

    // Filtrage par réseaux sociaux
    if (
      filters.socials &&
      filters.socials.length > 0 &&
      !filters.socials.some((social) =>
        rider.preferences.networks.some((network) => network === social),
      )
    ) {
      return false;
    }

    // Filtrage par type de contrat
    if (
      filters.contractType &&
      filters.contractType.length > 0 &&
      !filters.contractType.includes(rider.availibility.contractType)
    ) {
      return false;
    }

    // Filtrage par statut de sponsoring (déduire du nombre de sponsors actuels)
    if (filters.isBeenSponsored !== undefined) {
      const hasBeenSponsored = rider.sponsorSummary.totalSponsors > 0;
      if (hasBeenSponsored !== filters.isBeenSponsored) {
        return false;
      }
    }

    // Filtrage par disponibilité
    if (
      filters.isDisponible !== undefined &&
      rider.availibility.isAvailable !== filters.isDisponible
    ) {
      return false;
    }

    // Filtrage par âge (date de naissance)
    if (filters.minBirthdate || filters.maxBirthdate) {
      const riderBirthDate = new Date(rider.identity.birthDate);

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

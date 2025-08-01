import { Rider } from "@/src/lib/dashboard.lib";
import { ContractType, SportName } from "@kascad-app/shared-types";

// Filtres de recherche selon les spécifications
export type SearchFilters = {
  searchQuery?: string;
  sports?: string[];
  countries?: string[];
  gender?: string[];
  minBirthdate?: string;
  maxBirthdate?: string;
  languages?: string[];
  socials?: string[];
  isBeenSponsored?: boolean;
  isDisponible?: boolean;
  contractType?: string[];
};

// Recherche sauvegardée
export type SavedSearch = {
  id?: string;
  _id?: string;
  sponsorId: string;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  updatedAt: string;
  __v?: number;
};

// DTOs
export type CreateSavedSearchDto = {
  name: string;
  filters: SearchFilters;
  sponsorId: string;
};

export type UpdateSavedSearchDto = Partial<CreateSavedSearchDto>;

// Réponses de recherche
export type SearchResponse = {
  riders: Rider[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  hasMore: boolean;
};

export type SearchParams = SearchFilters & {
  page?: number;
  limit?: number;
  sortBy?: "name" | "joinedDate" | "age" | "level";
  sortOrder?: "asc" | "desc";
};

export const FILTER_OPTIONS = {
  sports: Object.values(SportName),
  countries: [
    "France",
    "États-Unis",
    "Canada",
    "Allemagne",
    "Espagne",
    "Italie",
    "Royaume-Uni",
    "Australie",
    "Japon",
  ],
  gender: ["Homme", "Femme", "Non-binaire"],
  languages: [
    "Français",
    "Anglais",
    "Espagnol",
    "Allemand",
    "Italien",
    "Japonais",
    "Portugais",
  ],
  socials: [
    "Instagram",
    "TikTok",
    "YouTube",
    "Facebook",
    "Twitter",
    "Snapchat",
  ],
  contractType: Object.values(ContractType),
} as const;

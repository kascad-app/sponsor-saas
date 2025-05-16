"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type FavoritesContextType = {
  favorites: string[];
  addFavorite: (riderId: string) => void;
  removeFavorite: (riderId: string) => void;
  isFavorite: (riderId: string) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

export const FavoritesProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const storedFavorites = localStorage.getItem("rider-favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("rider-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = (riderId: string) => {
    setFavorites((prev) => [...prev, riderId]);
  };

  const removeFavorite = (riderId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== riderId));
  };

  const isFavorite = (riderId: string) => {
    return favorites.includes(riderId);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, addFavorite, removeFavorite, isFavorite }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

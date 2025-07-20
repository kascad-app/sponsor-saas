"use client";

export const RidersErrorCard = ({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="text-center">
      <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
      <p className="text-muted-foreground mb-4">
        Impossible de charger les riders. Veuillez réessayer.
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
      >
        Réessayer
      </button>
    </div>
  </div>
);

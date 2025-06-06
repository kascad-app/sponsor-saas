"use client";

import { KascadLogo } from "@/src/shared/ui/Kascad-logo.ui";

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <div className="w-20 h-20 flex items-center justify-center">
            <KascadLogo />
          </div>
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
        </div>
      </div>
    </div>
  );
};

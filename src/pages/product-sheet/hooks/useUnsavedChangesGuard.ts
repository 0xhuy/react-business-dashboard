import { useEffect } from "react";
import { useBlocker } from "react-router-dom";

export const useUnsavedChangesGuard = (isDirty: boolean, isSaving: boolean) => {
  const navigationBlocker = useBlocker(isDirty && !isSaving);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty || isSaving) return;

      event.preventDefault();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, isSaving]);

  return navigationBlocker;
};

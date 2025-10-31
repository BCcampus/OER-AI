import React, { useState, useCallback } from "react";
import ModeContext, { type Mode } from "./mode";
import { useUserSession } from "../providers/usersession";

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("student");
  const { sessionUuid } = useUserSession();

  const setMode = useCallback(async (newMode: Mode) => {
    // Update local state immediately for responsive UI
    setModeState(newMode);

    // Update the user session role in the backend
    if (sessionUuid) {
      try {
        const tokenResponse = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/user/publicToken`
        );
        if (!tokenResponse.ok) {
          console.error("Failed to get public token");
          return;
        }
        const { token } = await tokenResponse.json();

        const response = await fetch(
          `${import.meta.env.VITE_API_ENDPOINT}/user_sessions/${sessionUuid}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ role: newMode }),
          }
        );

        if (!response.ok) {
          console.error("Failed to update user session role");
        }
      } catch (error) {
        console.error("Error updating user session role:", error);
      }
    }
  }, [sessionUuid]);

  return (
    <ModeContext.Provider value={{ mode, setMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export default ModeProvider;

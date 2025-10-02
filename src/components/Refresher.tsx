import { useState, useCallback } from "react";

export function useRefresher() {
  const [refresh, setRefresh] = useState(0);

  // function you can call anywhere in your component
  const doRefresh = useCallback(() => {
    setRefresh((r) => r + 1);
  }, []);

  return { refresh, doRefresh };
}

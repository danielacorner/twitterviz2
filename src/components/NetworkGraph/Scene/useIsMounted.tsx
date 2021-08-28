import { useState } from "react";
import { useMount } from "utils/utils";

export function useIsMounted() {
  const [isMounted, setIsMounted] = useState(false);
  useMount(() => {
    setIsMounted(true);
  });
  return isMounted;
}

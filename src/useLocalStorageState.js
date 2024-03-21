import { useState, useEffect } from "react";

export default function useLocalStorageState(key) {
  const [val, setVal] = useState(
    () => JSON.parse(localStorage.getItem(key)) || []
  );

  useEffect(
    function () {
      localStorage.setItem("watched", JSON.stringify(val));
    },
    [val]
  );
  return [val, setVal];
}

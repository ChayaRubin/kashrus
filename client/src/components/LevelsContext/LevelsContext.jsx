import React, { createContext, useContext, useState } from "react";

const LevelsContext = createContext();

const ALL_LEVELS = ["FIRST", "SECOND", "THIRD"];

export function LevelsProvider({ children }) {
  const [selected, setSelected] = useState(new Set(ALL_LEVELS));

  function toggle(level) {
    setSelected((prev) => {
      const copy = new Set(prev);
      if (copy.has(level)) copy.delete(level);
      else copy.add(level);
      return copy;
    });
  }

  function isSelected(level) {
    return selected.has(level);
  }

  return (
    <LevelsContext.Provider value={{ selected, toggle, isSelected }}>
      {children}
    </LevelsContext.Provider>
  );
}

export function useLevels() {
  return useContext(LevelsContext);
}

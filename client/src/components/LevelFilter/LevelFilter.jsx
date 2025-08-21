import React from "react";
import { useLevels } from "../../components/LevelsContext/LevelsContext.jsx";

const ALL_LEVELS = ["FIRST", "SECOND", "THIRD"]; // 👈 define it here

export default function LevelFilter() {
  const lv = useLevels();

  return (
    <div className="flex gap-4 items-center mb-4">
      <span className="font-semibold">Filter by level:</span>
      {ALL_LEVELS.map((level) => (
        <label key={level} className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={lv.isSelected(level)}
            onChange={() => lv.toggle(level)}
          />
          {level.charAt(0) + level.slice(1).toLowerCase()}
        </label>
      ))}
    </div>
  );
}

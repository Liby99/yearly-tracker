import React from "react"

import Quarter from "./Quarter"

export default function Year({ 
  year,
  showToday,
}: { 
  year: number,
  showToday: boolean,
}) {
  return (
    <div>
      <Quarter year={year} quarter={1} showToday={showToday} />
      <Quarter year={year} quarter={2} showToday={showToday} />
      <Quarter year={year} quarter={3} showToday={showToday} />
      <Quarter year={year} quarter={4} showToday={showToday} />
    </div>
  );
}

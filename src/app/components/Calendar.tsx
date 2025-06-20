import React from "react"

import Quarter from "./Quarter"

export default function Calendar({ year }: { year: number }) {
  return (
    <div>
      <Quarter year={year} quarter={1} />
      <Quarter year={year} quarter={2} />
      <Quarter year={year} quarter={3} />
      <Quarter year={year} quarter={4} />
    </div>
  );
}

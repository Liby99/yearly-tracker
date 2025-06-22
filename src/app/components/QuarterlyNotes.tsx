import React, { useRef, useState, useEffect } from "react"

export default function QuarterlyNotes(
  {
    year,
    quarter,
  }: {
    year: number,
    quarter: number,
  }
) {
  const gridX = 10;
  const gridY = 20;

  return (
    <div className="quarterly-note-content">
      {Array.from({length: gridY}, (_, i) => (
        <div key={i} className="quarterly-note-content-row flex">
          {Array.from({length: gridX}, (_, j) => (
            <div key={j} className="quarterly-note-content-cell">
              <div></div>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

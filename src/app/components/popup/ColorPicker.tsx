import React from "react"

const COLORS = ["default", "blue", "purple", "green", "yellow", "red"];

/**
 * A color picker, which contains a list of colors.
 * 
 * Offers the following features:
 * - Selecting a color
 * - Hovering over a color
 * 
 * @param color - The color of the picker
 * @param onSelectColor - The function to select a color
 * @param onHoverColor - The function to hover over a color
 */
export default function ColorPicker(
  {
    color,
    onSelectColor,
    onHoverColor,
  }: {
    color: string | null,
    onSelectColor: (c: string) => void,
    onHoverColor: (c: string | null) => void,
  }
) {
  const colorPickers = COLORS.map(c => {
    const active = color === c || (!color && c === "default");
    return (
      <span
        key={c}
        className={`sticker-menu-color-picker ${c}${active ? " active" : ""}`}
        onClick={() => onSelectColor(c)}
        onMouseEnter={() => onHoverColor(c)}
        onMouseLeave={() => onHoverColor(null)}
      />
    );
  });
  return (
    <>
      {colorPickers}
    </>
  )
}

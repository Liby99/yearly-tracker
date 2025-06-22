import React from "react"

const COLORS = ["default", "blue", "purple", "green", "yellow", "red"];

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

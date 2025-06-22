import React, { useRef, useState, useEffect } from "react"

import ColorPicker from "./ColorPicker";

export default function StickerMenu(
  {
    menuOpen,
    parentWidth,
    color,
    setMenuOpen,
    onSelectColor,
    onHoverColor,
    onRemove,
  }: {
    menuOpen: boolean,
    parentWidth: number,
    color: string | null,
    setMenuOpen: (open: boolean) => void,
    onSelectColor: (color: string) => void,
    onHoverColor: (color: string | null) => void,
    onRemove: () => void,
  }
) {
  const menuWidth = 180;
  const marginLeft = (parentWidth - menuWidth) / 2;

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = () => setMenuOpen(false);
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  return (
    <>
      {menuOpen && (
        <div
          className="sticker-menu-holder"
          style={{
            top: -36,
            marginTop: 0,
            marginLeft: `${marginLeft}px`,
            width: menuWidth,
          }}
        >
          <div className="flex sticker-menu" onMouseDown={e => e.stopPropagation()}>
            <ColorPicker
              color={color}
              onSelectColor={onSelectColor}
              onHoverColor={onHoverColor}
            />
            <span className="sticker-menu-div"></span>
            <span
              className="sticker-menu-delete-button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onRemove();
              }}
            >
              <i className="fa fa-trash"></i>
            </span>
          </div>
          <div className="sticker-menu-caret-holder">
            <i className="fa fa-caret-down"></i>
          </div>
        </div>
      )}
    </>
  )
}

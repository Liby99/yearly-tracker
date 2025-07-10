import React, { useEffect, useRef, useState } from "react"

import ColorPicker from "./ColorPicker";

export default function StickerMenu(
  {
    menuOpen,
    parentWidth,
    color,
    otherButtons,
    setMenuOpen,
    onSelectColor,  
    onHoverColor,
    onRemove,
  }: {
    menuOpen: boolean,
    parentWidth: number,
    color: string | null,
    otherButtons: React.ReactNode | null,
    setMenuOpen: (open: boolean) => void,
    onSelectColor: (color: string) => void,
    onHoverColor: (color: string | null) => void,
    onRemove: () => void,
  }
) {
  const menuRef = useRef<HTMLDivElement>(null);
  const [marginLeft, setMarginLeft] = useState<number>(0);

  useEffect(() => {
    if (menuOpen && menuRef.current) {
      const menuWidth = menuRef.current.offsetWidth;
      setMarginLeft((parentWidth - menuWidth) / 2);
    }
  }, [menuOpen, parentWidth, otherButtons]); // re-run if menu content changes

  // Close menu on click outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = () => setMenuOpen(false);
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
    // eslint-disable-next-line
  }, [menuOpen]);

  const menuHolderStyle = {
    marginLeft: `${marginLeft}px`,
    width: "fit-content",
  };

  const onRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove();
  };

  return (
    <>
      {menuOpen && (
        <div className="sticker-menu-holder" style={menuHolderStyle}>
          <div className="flex sticker-menu" ref={menuRef} onMouseDown={e => e.stopPropagation()}>
            <ColorPicker color={color} onSelectColor={onSelectColor} onHoverColor={onHoverColor} />
            <span className="sticker-menu-div"></span>
            {otherButtons && (
              <>
                {otherButtons}
                <span className="sticker-menu-div"></span>
              </>
            )}
            <span className="sticker-menu-button" onClick={onRemoveClick}>
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

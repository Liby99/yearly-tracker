interface FooterProps {
  setShowHelp: (show: boolean) => void;
  setShowSettings: (show: boolean) => void;
}

export default function Footer({ setShowHelp, setShowSettings }: FooterProps) {
  return (
    <footer className="screen-only">
    &copy; 2025 <a href="https://liby99.github.io">Liby99</a>, all rights reserved.
    <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
    <a onClick={() => setShowHelp(true)}>Help</a>
    <span style={{ display: "inline-block", margin: "0 5px" }}>|</span>
    <a onClick={() => setShowSettings(true)}>Settings</a>
    </footer>
  )
}
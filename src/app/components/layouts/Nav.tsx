import NavMenu from "../buttons/NavMenu";

interface NavProps {
  year: number;
  setYear: (year: number) => void;
  setShowSettings: (show: boolean) => void;
  setShowHelp: (show: boolean) => void;
  setShowSignIn: (show: boolean) => void;
  setShowChangePassword: (show: boolean) => void;
  setShowRemoveAccount: (show: boolean) => void;
}

export default function Nav({ year, setYear, setShowSettings, setShowHelp, setShowSignIn, setShowChangePassword, setShowRemoveAccount }: NavProps) {
  return (
    <nav className="flex">
        <span className="page-title">YEARLY TRACKER</span>
        <span style={{ position: "relative", display: "inline-block" }}>
          {year}
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="nav-year-select">
            {Array.from({ length: 7 }, (_, i) => 2024 + i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </span>
        <span style={{ display: "inline-block", flex: 1 }}></span>
        <NavMenu
          setShowSettings={setShowSettings}
          setShowHelp={setShowHelp}
          setShowSignIn={setShowSignIn}
          setShowChangePassword={setShowChangePassword}
          setShowRemoveAccount={setShowRemoveAccount}
        />
      </nav>
  )
}

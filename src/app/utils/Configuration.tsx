type ExternalCalendar = "google" | "outlook" | "apple" | "ics" | "ics-url";

type Configuration = {
  // Whether to show the current day in the calendar
  showToday: boolean,

  // The external calendar to use for adding events to calendar
  externalCalendar: ExternalCalendar,

  // The theme for the calendar
  theme: "auto" | "light" | "dark",
}

export default Configuration;

export type { ExternalCalendar };

export function defaultConfiguration(): Configuration {
  return {
    showToday: true,
    externalCalendar: "ics",
    theme: "light",
  };
}

export function getConfiguration() {
  const configuration = localStorage.getItem("configuration");
  return configuration ? JSON.parse(configuration) : defaultConfiguration();
}

export function setConfiguration(configuration: Configuration) {
  localStorage.setItem("configuration", JSON.stringify(configuration));
}

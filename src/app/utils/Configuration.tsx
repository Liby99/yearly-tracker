type Configuration = {
  // Whether to show the current day in the calendar
  showToday: boolean,
}

export default Configuration;

export function defaultConfiguration(): Configuration {
  return {
    showToday: true,
  };
}

export function getConfiguration() {
  const configuration = localStorage.getItem("configuration");
  return configuration ? JSON.parse(configuration) : defaultConfiguration();
}

export function setConfiguration(configuration: Configuration) {
  localStorage.setItem("configuration", JSON.stringify(configuration));
}

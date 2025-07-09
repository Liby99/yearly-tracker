import React, { useRef } from "react";
import type ConfigurationType from "../utils/Configuration";
import type { ExternalCalendar } from "../utils/Configuration";
import { downloadCalendarData, localStorageSetCalendarData, localStorageClearCalendarData } from "../utils/CalendarData";

interface ConfigurationProps {
  year: number;
  showSettings: boolean;
  configuration: ConfigurationType;
  setShowSettings: (show: boolean) => void;
  setConfiguration: (configuration: ConfigurationType) => void;
}

export default function Configuration({
  year,
  showSettings,
  configuration,
  setShowSettings,
  setConfiguration,
}: ConfigurationProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!showSettings) return null;

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      let json = { years: {} };

      // Load
      try {
        json = JSON.parse(event.target?.result as string);
      } catch (err) {
        alert(`Error parsing input file "${file}". Please check console for error information.`);
        console.error(err);
        return;
      }

      localStorageSetCalendarData(json);
      window.location.reload(); // Reload to reflect changes
    };

    reader.readAsText(file);
    e.target.value = "";
  };

  const handleErase = () => {
    if (confirm(`Do you want to erase all notes and events in the year of ${year}?`)) {
      localStorageClearCalendarData();
      window.location.reload(); // Reload to reflect changes
    }
  };

  const setShowToday = (showToday: boolean) => {
    const newConfig = { ...configuration, showToday };
    setConfiguration(newConfig);
  };

  const setExternalCalendar = (externalCalendar: ExternalCalendar) => {
    const newConfig = { ...configuration, externalCalendar };
    setConfiguration(newConfig);
  };

  return (
    <div className="modal-overlay" onClick={() => setShowSettings(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>Settings</h2>
          <button 
            className="modal-close-button"
            onClick={() => setShowSettings(false)}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <div className="setting-item">
            <label>Show Today Marker</label>
            <div className="button-group">
              <button
                className={`button-group-button${configuration.showToday ? ' active' : ''}`}
                onClick={() => setShowToday(true)}
              >
                On
              </button>
              <button
                className={`button-group-button${!configuration.showToday ? ' active' : ''}`}
                onClick={() => setShowToday(false)}
              >
                Off
              </button>
            </div>
            <p className="setting-description">
              Display a visual indicator for today's date on the calendar.
            </p>
          </div>
          
          <div className="setting-item">
            <label>Default Calendar Export Format</label>
            <div className="button-group">
              <button
                className={`button-group-button${configuration.externalCalendar === "ics" ? ' active' : ''}`}
                onClick={() => setExternalCalendar("ics")}
              >
                <i className="fa fa-download" style={{marginRight: 5}}></i> .ics
              </button>
              <button
                className={`button-group-button${configuration.externalCalendar === "ics-url" ? ' active' : ''}`}
                onClick={() => setExternalCalendar("ics-url")}
              >
                <i className="fa fa-external-link" style={{marginRight: 5}}></i> .ics
              </button>
              <button
                className={`button-group-button${configuration.externalCalendar === "google" ? ' active' : ''}`}
                onClick={() => setExternalCalendar("google")}
              >
                <i className="fa fa-google" style={{marginRight: 5}}></i> Google
              </button>
              <button
                className={`button-group-button${configuration.externalCalendar === "outlook" ? ' active' : ''}`}
                onClick={() => setExternalCalendar("outlook")}
              >
                <i className="fa fa-envelope" style={{marginRight: 5}}></i> Outlook
              </button>
              <button
                className={`button-group-button${configuration.externalCalendar === "apple" ? ' active' : ''}`}
                onClick={() => setExternalCalendar("apple")}
              >
                <i className="fa fa-apple" style={{marginRight: 5}}></i> Apple
              </button>
            </div>
            <p className="setting-description">
              Choose the default calendar export method when adding events to external calendars.
            </p>
          </div>

          <div className="setting-section">
            <h3>Data Management</h3>
            <div className="setting-item">
              <button
                className="setting-button"
                onClick={() => {
                  downloadCalendarData("yearly-tracker-calendar.json");
                }}
              >
                <i className="fa fa-save" style={{marginRight: 5}}></i>
                Save Calendar Data
              </button>
              <p className="setting-description">
                Download all your calendar data as a JSON file for backup.
              </p>
            </div>
            
            <div className="setting-item">
              <button
                className="setting-button"
                onClick={handleUploadClick}
              >
                <i className="fa fa-upload" style={{marginRight: 5}}></i>
                Load Calendar Data
              </button>
              <p className="setting-description">
                Upload a previously saved JSON file to restore your calendar data.
              </p>
              <input
                type="file"
                accept=".json,application/json"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
            
            <div className="setting-item">
              <button
                className="setting-button danger"
                onClick={handleErase}
              >
                <i className="fa fa-eraser" style={{marginRight: 5}}></i>
                Erase All Data
              </button>
              <p className="setting-description">
                Permanently delete all notes and events. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
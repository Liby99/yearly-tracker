import React from "react";

interface HelpProps {
  showHelp: boolean;
  setShowHelp: (show: boolean) => void;
}

export default function Help({
  showHelp,
  setShowHelp,
}: HelpProps) {
  if (!showHelp) return null;

  return (
    <div className="modal-overlay screen-only" onClick={() => setShowHelp(false)}>
      <div className="modal-content screen-only" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ margin: 0 }}>Help &amp; Instructions</h2>
          <button 
            className="modal-close-button"
            onClick={() => setShowHelp(false)}
          >
            <i className="fa fa-times"></i>
          </button>
        </div>
        <div className="modal-body">
          <p className="help-description">
            This is a simple calendar app that allows you to create events and notes.
            This help page will guide you through the basic features of the app.
          </p>
        
          <div className="setting-section">
            <h2>1. Getting Started</h2>
            <div className="setting-item">
              <label>Year Selection</label>
              <p className="help-description">
                Click on the year number in the top navigation to change the displayed year. 
                The year selector allows you to view and edit calendars from 2024 to 2030.
              </p>
            </div>

            <div className="setting-item">
              <label>Today Marker</label>
              <p className="help-description">
                The today marker shows a visual indicator for the current date. 
                You can toggle this feature in Settings.
              </p>
            </div>
          </div>

          <div className="setting-section">
            <h2>2. Creating Events</h2>
            <div className="setting-item">
              <label>Adding Events</label>
              <p className="help-description">
                Click and drag across multiple days in any topic row to create an event. 
                The event will span the selected days and you can type a name for it.
              </p>
            </div>

            <div className="setting-item">
              <label>Editing Events</label>
              <p className="help-description">
                Click on any event to edit its name. Right-click to open the event menu 
                for color changes and deletion options.
              </p>
            </div>

            <div className="setting-item">
              <label>Resizing Events</label>
              <p className="help-description">
                Drag the left or right handles of an event to change its duration. 
                The handles appear when you hover over an event.
              </p>
            </div>

            <div className="setting-item">
              <label>Event Colors</label>
              <p className="help-description">
                Right-click on an event to change its color. Available colors: Default (brown), 
                Blue, Purple, Green, Yellow, and Red.
              </p>
            </div>
          </div>

          <div className="setting-section">
            <h2>3. Managing Topics</h2>
            <div className="setting-item">
              <label>Topic Names</label>
              <p className="help-description">
                Click on any topic name to edit it. Topics help you organize different 
                types of events or activities.
              </p>
            </div>

            <div className="setting-item">
              <label>Reordering Topics</label>
              <p className="help-description">
                Drag the handle (⋮⋮) next to a topic name to reorder topics within a month. 
                The order is saved automatically.
              </p>
            </div>
          </div>

          <div className="setting-section">
            <h2>4. Quarterly Notes</h2>
            <div className="setting-item">
              <label>Adding Notes</label>
              <p className="help-description">
                Click and drag in the quarterly notes area (left side) to create notes. 
                Notes can be resized and moved around the grid.
              </p>
            </div>

            <div className="setting-item">
              <label>Note Features</label>
              <p className="help-description">
                Notes support text input and can be colored. Drag the corner to resize 
                or the center to move. Right-click for color options.
              </p>
            </div>
          </div>

          <div className="setting-section">
            <h2>5. Calendar Export</h2>
            <div className="setting-item">
              <label>Adding to External Calendars</label>
              <p className="help-description">
                Right-click on any event and select the calendar icon to add it to your 
                external calendar. Choose your preferred method in Settings.
              </p>
            </div>

            <div className="setting-item">
              <label>Export Options</label>
              <ul className="help-description" style={{ marginLeft: '20px' }}>
                <li><strong>Download .ics:</strong> Downloads a file that opens in your default calendar app</li>
                <li><strong>Open .ics:</strong> Opens the calendar event in a new browser tab</li>
                <li><strong>Google Calendar:</strong> Opens Google Calendar with the event pre-filled</li>
                <li><strong>Outlook:</strong> Opens Outlook Calendar with the event pre-filled</li>
                <li><strong>Apple Calendar:</strong> Downloads .ics file for Apple Calendar</li>
              </ul>
            </div>
          </div>

          <div className="setting-section">
            <h2>6. Data Management</h2>
            <div className="setting-item">
              <label>Saving Your Data</label>
              <p className="help-description">
                All your events, notes, and settings are automatically saved to your browser&apos;s 
                local storage. Use the Save Calendar Data option in Settings for backup.
              </p>
            </div>

            <div className="setting-item">
              <label>Backup &amp; Restore</label>
              <p className="help-description">
                Save your calendar data as a JSON file for backup. You can later upload 
                this file to restore all your events and notes.
              </p>
            </div>

            <div className="setting-item">
              <label>PDF Generation</label>
              <p className="help-description">
                Generate PDF versions of your calendar for printing or sharing. 
                The Print &amp; Save as PDF option provides the best quality.
              </p>
            </div>
          </div>

          <div className="setting-section">
            <h2>7. Keyboard Shortcuts</h2>
            <div className="setting-item">
              <p className="help-description">
                <strong>Delete/Backspace:</strong> When an event name is empty, pressing Delete or Backspace will remove the event.<br/>
                <strong>Enter:</strong> Finish editing an event name.<br/>
                <strong>Escape:</strong> Cancel editing an event name.
              </p>
            </div>
          </div>

          <div className="setting-section">
            <h2>8. Tips &amp; Tricks</h2>
            <div className="setting-item">
              <ul className="help-description" style={{ marginLeft: '20px' }}>
                <li>Use different colors to categorize your events</li>
                <li>Create multiple topics to organize different types of activities</li>
                <li>Use quarterly notes for planning and reflection</li>
                <li>Export important events to your external calendar</li>
                <li>Regularly backup your data using the save function</li>
                <li>The calendar automatically handles month boundaries and leap years</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
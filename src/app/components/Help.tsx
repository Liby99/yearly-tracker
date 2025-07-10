import React from "react";
import Image from "next/image";

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
          <div className="setting-section">
            <h2>🚀 Getting Started</h2>
            <p className="help-description">
              This is a simple calendar app that allows you to create events and notes.
              This help page will guide you through the basic features of the app.
            </p>

            <div className="setting-item" style={{ marginTop: "15px" }}>
              <label>Year Selection</label>
              <p className="help-description">
                Click on the year number in the top navigation to change the displayed year. 
                The year selector allows you to view and edit calendars from 2024 to 2030.
              </p>
            </div>

            <div className="setting-item">
              <Image src="/images/help/monthly-topic.png" alt="Months and Topics" width={170} height={170} />
              <label>Months and Topics</label>
              <p className="help-description">
                Each year is divided into 4 quarters, and each quarter is divided into 3 months.
                You can create topics for each month, and then create events for each topic.
                Topics help you organize different types of events or activities that you should focus on each month.
              </p>
            </div>

            <div className="setting-item">
              <Image src="/images/help/today.png" alt="Today Marker" width={160} height={160} />
              <label>Today Marker</label>
              <p className="help-description">
                The today marker shows a visual indicator for the current date. 
                You can toggle this feature in Settings.
              </p>
            </div>
          </div>

          <div className="setting-section">
            <h2>📅 Creating Events</h2>
            <div className="setting-item">
              <Image src="/images/help/events.png" alt="Adding Events" width={500} height={500} />
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
              <Image src="/images/help/event-resize.png" alt="Resizing Events" width={70} height={70} />
              <label>Resizing Events</label>
              <p className="help-description">
                Drag the left or right handles of an event to change its duration. 
                The handles appear when you hover over an event.
              </p>
            </div>

            <div className="setting-item">
              <Image src="/images/help/event-recolor.png" alt="Event Colors" width={70} height={70} />
              <label>Event Colors</label>
              <p className="help-description">
                Right-click on an event to change its color. Available colors: Default (brown), 
                Blue, Purple, Green, Yellow, and Red.
              </p>
            </div>

            <div className="setting-item">
              <Image src="/images/help/external-calendar.png" alt="Adding Events to External Calendars" width={100} height={100} />
              <label>Adding Events to External Calendars</label>
              <p className="help-description">
                Right-click on an event and select the calendar icon to add it to your external calendar. 
                You can choose your preferred method in Settings.
              </p>
            </div>
          </div>

          <div className="setting-section">
            <h2>🏷️ Managing Topics</h2>
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
            <h2>📝 Quarterly Notes</h2>
            <p className="help-description">
              Quarterly notes are a great way to plan and reflect on high-level goals and objectives.
              You can add notes to each quarter and they will be displayed in the quarterly notes area.
            </p>
            <div className="setting-item">
              <Image src="/images/help/notes.png" alt="Quarterly Notes" width={200} height={200} />
              <label>Adding Notes</label>
              <p className="help-description">
                Click and drag in the quarterly notes area (left side) to create notes. 
                All the notes are saved automatically.
                Click on the note to add text to it.
              </p>
            </div>

            <div className="setting-item">
              <Image src="/images/help/note-resize.png" alt="Resizing Notes" width={200} height={200} />
              <label>Resizing Notes</label>
              <p className="help-description">
                When you hover over a note, you will see a drag handle on the top left corner, and a resize handle on the bottom right corner.
                Drag the drag handle to move the note, and the resize handle to change the size of the note.
                The note will be saved automatically.
              </p>
            </div>

            <div className="setting-item">
              <Image src="/images/help/note-recolor.png" alt="Note Colors" width={200} height={200} />
              <label>Note Colors</label>
              <p className="help-description">
                You can change the color of a note by right-clicking on it and selecting a color from the color picker.
              </p>
            </div>

            <div className="setting-item">
              <label>Deleting Notes</label>
              <p className="help-description">
                After right clicking on a note, you will see a delete option.
                Or you can just remove all the text in the note before hitting delete/backspace another time.
              </p>
            </div>
          </div>

          <div className="setting-section">
            <h2>📤 Calendar Export</h2>
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
            <h2>💾 Data Management</h2>
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
            <h2>⌨️ Keyboard Shortcuts</h2>
            <div className="setting-item">
              <p className="help-description">
                <strong>Delete/Backspace:</strong> When an event name is empty, pressing Delete or Backspace will remove the event.<br/>
                <strong>Enter:</strong> Finish editing an event name.<br/>
                <strong>Escape:</strong> Cancel editing an event name.
              </p>
            </div>
          </div>

          <div className="setting-section">
            <h2>💡 Tips &amp; Tricks</h2>
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
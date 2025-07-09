import React, { useState, useEffect } from "react"

import Day from "./Day"
import EventData, { createEventData, eventDataContains } from "../utils/EventData"
import {
  localStorageMonthlyTopicName,
  localStorageSetMonthlyTopicName,
  localStorageMonthlyTopicEvents,
  localStorageSetMonthlyTopicEvents
} from "../utils/MonthlyTopicData"
import { ExternalCalendar } from "../utils/Configuration";

const MAX_DAYS_IN_MONTH = 31;

/**
 * A monthly topic, which contains days of the month, as well as events under this topic.
 * 
 * Offers the following features:
 * - Changing topic name
 * - Adding events
 * - Removing events
 * - Resizing events
 * - Changing event names
 * - Changing event colors
 * 
 * @param year - The year of the topic
 * @param month - The month of the topic
 * @param topicId - The id of the topic
 * @param showToday - Whether to show the today marker on the topic
 * @param onTopicDragStart - The function to start dragging the topic
 * @param onTopicDragOver - The function to handle dragging over the topic
 * @param onTopicDragEnd - The function to end dragging the topic
 */
export default function MonthlyTopic(
  {
    year,
    month,
    topicId,
    showToday,
    externalCalendar,
    onTopicDragStart,
    onTopicDragOver,
    onTopicDragEnd,
  }: {
    year: number,
    month: number,
    topicId: number,
    showToday: boolean,
    externalCalendar: ExternalCalendar,
    onTopicDragStart: () => void,
    onTopicDragOver: (e: React.DragEvent) => void,
    onTopicDragEnd: () => void,
  }
) {
  const [isDraggingTopic, setIsDraggingTopic] = useState(false);

  // Related to topic
  const [topicName, setTopicName] = useState<string>("");

  useEffect(() => {
    setTopicName(localStorageMonthlyTopicName(year, month, topicId));
    // eslint-disable-next-line
  }, [year, month]);

  // Save to localStorage whenever topics change
  useEffect(() => {
    localStorageSetMonthlyTopicName(year, month, topicId, topicName);
    // eslint-disable-next-line
  }, [topicName, year, month]);

  // Related to event ranges
  const [dragging, setDragging] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ start: number | null, end: number | null}>({ start: null, end: null });
  const [events, setEvents] = useState<Array<EventData>>([]);

  // Load from localStorage when year changes
  useEffect(() => {
    setEvents(localStorageMonthlyTopicEvents(year, month, topicId));
    // eslint-disable-next-line
  }, [year, month]);

  // Save to localStorage whenever ranges change
  useEffect(() => {
    localStorageSetMonthlyTopicEvents(year, month, topicId, events);
    // eslint-disable-next-line
  }, [events, year, month]);

  const removeEvent = (day: number) => {
    setEvents(events.filter(range => range.start != day));
    setResizing(null);
    setDragging(false);
  }

  // Related to resizing
  const [resizing, setResizing] = useState<null | {side: "left"|"right", resizingDay: number, otherDay: number}>(null);

  const handleResizeStart = (side: "left" | "right", resizingDay: number, otherDay: number) => {
    setResizing({ side, resizingDay, otherDay });
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLDivElement>) => {
    // Calculate which day was clicked
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const dayHolder = event.currentTarget.querySelector('.day-holder') as HTMLElement;
    const dayWidth = dayHolder ? dayHolder.offsetWidth : 30;
    let day = Math.floor(x / dayWidth) + 1;
    if (day < 1) day = 1;
    if (day > 31) day = 31;

    // Prevent starting selection if clicking on an existing range
    for (const event of events) {
      if (eventDataContains(event, day)) {
        return;
      }
    }

    setDragging(true);
    setSelectedRange({ start: day, end: day });
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      if (selectedRange.start === null) return;

      // Get the bounding rect of the container
      const rect = event.currentTarget.getBoundingClientRect();

      // Calculate the day index based on mouse X position
      const x = event.clientX - rect.left;
      let day = Math.floor(x / 30) + 1; // 30 is the width of .day-holder
      if (day < 1) day = 1;
      if (day > 31) day = 31;

      if (selectedRange.end !== day) {
        setSelectedRange({ start: selectedRange.start, end: day });
      }
    }

    if (resizing) {
      // Get mouse position relative to the container
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const dayHolder = event.currentTarget.querySelector('.day-holder') as HTMLElement;
      const dayWidth = dayHolder ? dayHolder.offsetWidth : 30;
      let day = Math.floor(x / dayWidth) + 1;
      if (day < 1) day = 1;
      if (day > 31) day = 31;

      setEvents(events =>
        events.map(event => {
          if (resizing.side === "left" && event.end === resizing.otherDay) {
            // Prevent crossing over the end
            const newStart = Math.min(day, event.end);
            return {...event, start: newStart};
          } else if (resizing.side === "right" && event.start === resizing.otherDay) {
            // right side
            const newEnd = Math.max(day, event.start);
            return {...event, end: newEnd};
          }
          return event;
        })
      );
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      if (selectedRange.start && selectedRange.end) {
        setEvents([...events, createEventData(selectedRange.start, selectedRange.end, "", null)]);
      }
      setSelectedRange({ start: null, end: null });
    }

    setDragging(false);
    setResizing(null);
  };

  const modifyEvent = (day: number, update: (event: EventData) => EventData) => {
    const newEvents = events.map(event => event.start === day ? update(event) : event);
    setEvents(newEvents);
  };

  const changeEventName = (day: number, name: string) => {
    modifyEvent(day, (oldEvent) => createEventData(oldEvent.start, oldEvent.end, name, oldEvent.color));
  };

  const changeEventColor = (day: number, color: string) => {
    modifyEvent(day, (oldEvent) => createEventData(oldEvent.start, oldEvent.end, oldEvent.name, color));
  };

  return (
    <div
      className="flex month-topic-holder"
      onDragOver={onTopicDragOver}
      onDragEnd={() => {
        onTopicDragEnd();
        setIsDraggingTopic(false);
      }}
    >
      <div
        className="month-topic-header flex"
        draggable={true}
      >
        <div className="flex month-topic-input-holder">
          <input
            className="month-topic-input"
            value={topicName}
            onChange={e => setTopicName(e.target.value)}
          />
          <div
            className={`monthly-topic-drag-handle${isDraggingTopic ? " active" : ""}`}
            onMouseDown={() => {
              onTopicDragStart();
              setIsDraggingTopic(true);
            }}
            onMouseUp={() => {
              onTopicDragEnd();
              setIsDraggingTopic(false);
            }}
          >
            <i className="fa fa-bars"></i>
          </div>
        </div>
      </div>
      <div
        className="flex month-topic-dates"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {Array.from({ length: MAX_DAYS_IN_MONTH }, (_, i) => i + 1).map(i => (
          <Day
            key={`month-${month}-topic-${topicId}-day-${i}`}
            year={year}
            month={month}
            day={i}
            topicName={topicName}
            selectedRange={selectedRange}
            events={events}
            resize={resizing}
            removeEvent={removeEvent}
            changeEventName={changeEventName}
            changeEventColor={changeEventColor}
            onResizeStart={handleResizeStart}
            showToday={showToday}
            externalCalendar={externalCalendar}
          />
        ))}
      </div>
    </div>
  );
}

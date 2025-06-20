import React, { useState, useEffect, useRef } from "react"

import Day from "./Day"
import EventData from "../utils/EventData"

export default function MonthTopic(
  {
    year,
    month,
    topicId,
  }: {
    year: number,
    month: number,
    topicId: number,
  }
) {
  // Related to topic
  const [topic, setTopic] = useState("");

  // Load from localStorage when year changes
  useEffect(() => {
    const saved = localStorage.getItem(`year-${year}/month-${month}/topic-${topicId}/topic`);
    if (saved) {
      setTopic(saved);
    } else {
      setTopic("");
    }
  }, [year]);

  // Save to localStorage whenever topics change
  useEffect(() => {
    localStorage.setItem(`year-${year}/month-${month}/topic-${topicId}/topic`, topic);
  }, [topic, year]);

  // Related to event ranges
  const [dragging, setDragging] = useState(false);
  const [selectedRange, setSelectedRange] = useState<{ start: number | null, end: number | null}>({ start: null, end: null });
  const [ranges, setRanges] = useState<Array<EventData>>([]);

  // Load from localStorage when year changes
  useEffect(() => {
    const saved = localStorage.getItem(`year-${year}/month-${month}/topic-${topicId}/events`);
    if (saved) {
      setRanges(JSON.parse(saved).map(({start, end, name}: {start: number, end: number, name: string}) => new EventData(start, end, name)));
    } else {
      setRanges([]);
    }
  }, [year]);

  // Save to localStorage whenever ranges change
  useEffect(() => {
    const toStore = ranges.map(range => ({start: range.start, end: range.end, name: range.name}));
    localStorage.setItem(`year-${year}/month-${month}/topic-${topicId}/events`, JSON.stringify(toStore));
  }, [ranges, year]);

  const removeEvent = (day: number) => {
    setRanges(ranges.filter(range => range.start != day));
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
    for (const range of ranges) {
      if (range.contains(day)) {
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

      setRanges(ranges =>
        ranges.map(range => {
          if (resizing.side === "left" && range.end === resizing.otherDay) {
            // Prevent crossing over the end
            const newStart = Math.min(day, range.end);
            return new EventData(newStart, range.end, range.name);
          } else if (resizing.side === "right" && range.start === resizing.otherDay) {
            // right side
            const newEnd = Math.max(day, range.start);
            return new EventData(range.start, newEnd, range.name);
          }
          return range;
        })
      );
    }
  };

  const handleMouseUp = () => {
    if (dragging) {
      if (selectedRange.start && selectedRange.end) {
        setRanges([...ranges, new EventData(selectedRange.start, selectedRange.end, "")]);
      }
      setSelectedRange({ start: null, end: null });
    }

    setDragging(false);
    setResizing(null);
  };

  const changeEventName = (day: number, name: string) => {
    const newRanges = ranges.map(range => {
      if (range.start === day) {
        return new EventData(range.start, range.end, name);
      } else {
        return range
      }
    });
    setRanges(newRanges);
  };

  return (
    <div className="flex month-topic-holder">
      <div className="month-topic-header flex">
        <div className="month-topic-input-holder">
          <input
            className="month-topic-input"
            value={topic}
            onChange={e => setTopic(e.target.value)}
          />
        </div>
      </div>
      <div
        className="flex month-topic-dates"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {Array.from({ length: 31 }, (_, i) => i + 1).map(i => (
          <Day
            key={`month-${month}-topic-${topicId}-day-${i}`}
            year={year}
            month={month}
            topicId={topicId}
            day={i}
            selectedRange={selectedRange}
            ranges={ranges}
            resize={resizing}
            removeEvent={removeEvent}
            changeEventName={changeEventName}
            onResizeStart={handleResizeStart}
          />
        ))}
      </div>
    </div>
  );
}

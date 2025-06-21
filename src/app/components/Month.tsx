import React, { useState, useEffect, useRef } from "react"

import MonthlyTopic from "./MonthlyTopic"

function monthName(month: number) : string {
  switch (month) {
    case 1: return "jan";
    case 2: return "feb";
    case 3: return "mar";
    case 4: return "apr";
    case 5: return "may";
    case 6: return "jun";
    case 7: return "jul";
    case 8: return "aug";
    case 9: return "sep";
    case 10: return "oct";
    case 11: return "nov";
    case 12: return "dec";
    default: throw new DOMException(`Unknown month ${month}`);
  }
}

export default function Month({ year, month }: { year: number, month: number }) {
  // The current ordering of the monthly topics
  const topicOrderStorageKey = `year-${year}/month-${month}/topic-order`;
  const defaultOrder = [0, 1, 2, 3];
  const [topicOrder, setTopicOrder] = useState<Array<number>>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem(topicOrderStorageKey);
      return saved ? JSON.parse(saved) : defaultOrder;
    } else {
      return defaultOrder;
    }
  });

  // The topic ordering
  useEffect(() => {
    console.log(`Saving topic order ${year} ${month} ${topicOrder}`);
    localStorage.setItem(topicOrderStorageKey, JSON.stringify(topicOrder));
  }, [topicOrder]);

  // What is the monthly topic that is being dragged right now
  const dragItem = useRef<number | null>(null);

  const handleDragStart = (idx: number) => {
    dragItem.current = idx;
  };

  const handleDragOver = (idx: number, e: React.DragEvent) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === idx) return;
    setTopicOrder((prev) => {
      const newOrder = [...prev];
      const [removed] = newOrder.splice(dragItem.current!, 1);
      newOrder.splice(idx, 0, removed);
      dragItem.current = idx;
      return newOrder;
    });
  };

  const handleDragEnd = () => {
    dragItem.current = null;
  };

  return (
    <div className="month-bar flex">
      <div className="month-header period-header items-center justify-center">{monthName(month)}</div>
      <div className="month-topics">
        {topicOrder.map((i, idx) => (
          <MonthlyTopic
            key={`month-${month}-topic-${i}`}
            year={year}
            month={month}
            topicId={i}
            onTopicDragStart={() => handleDragStart(idx)}
            onTopicDragOver={(e) => handleDragOver(idx, e)}
            onTopicDragEnd={handleDragEnd}
          />
        ))}
      </div>
    </div>
  );
}

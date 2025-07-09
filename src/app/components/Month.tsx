import React, { useState, useEffect, useRef } from "react"

import MonthlyTopic from "./MonthlyTopic"
import { DEFAULT_TOPICS_IDS, localStorageMonthlyTopicOrder, localStorageSetMonthlyTopicOrder } from "../utils/MonthData"

/**
 * A month, which contains topics of each month.
 * 
 * Offers the following features:
 * - Dragging and dropping topics
 * 
 * @param year - The year of the month
 * @param month - The month of the year
 * @param showToday - Whether to show the today marker on the month
 */
export default function Month({ 
  year, 
  month, 
  showToday,
}: { 
  year: number, 
  month: number, 
  showToday: boolean,
}) {
  // The current ordering of the monthly topics
  const [topicOrder, setTopicOrder] = useState<Array<number>>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      return localStorageMonthlyTopicOrder(year, month);
    } else {
      return DEFAULT_TOPICS_IDS;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      setTopicOrder(localStorageMonthlyTopicOrder(year, month));
    } else {
      setTopicOrder(DEFAULT_TOPICS_IDS);
    }
  }, [year, month]);

  // The topic ordering
  useEffect(() => {
    localStorageSetMonthlyTopicOrder(year, month, topicOrder);
    // eslint-disable-next-line
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
            showToday={showToday}
          />
        ))}
      </div>
    </div>
  );
}

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

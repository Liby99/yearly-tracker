import Image from "next/image";

class Topic {

}

function Day({ month, topicId, day }: { month: number, topicId: number, day: number }) {
  return (
    <div className="day-holder">
      <div className="day-event"></div>
    </div>
  )
}

function MonthTopic({ month, topicId, topic }: { month: number, topicId: number, topic: Topic | undefined }) {
  return (
    <div className="flex month-topic-holder">
      <div className="month-topic-header flex">
        <div className="month-topic-input-holder">
          <input className="month-topic-input" />
        </div>

      </div>
      <div className="flex month-topic-dates">
        {Array.from({ length: 31 }, (_, i) => i + 1).map(i => (
          <Day key={`month-${month}-topic-${topicId}-day-${i}`} month={month} topicId={topicId} day={i} />
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

function Month({ month }: { month: number }) {
  return (
    <div className="month-bar flex">
      <div className="month-header period-header items-center justify-center">{monthName(month)}</div>
      <div className="month-topics">
        {Array.from({ length: 4 }, (_, i) => i).map((i) => (
          <MonthTopic key={`month-${month}-topic-${i}`} month={month} topicId={i} topic={undefined} />
        ))}
      </div>
    </div>
  );
}

function quarterHeader(quarter: number) : string {
  switch (quarter) {
    case 1: return "1st";
    case 2: return "2nd";
    case 3: return "3rd";
    case 4: return "4th";
    default: throw new DOMException(`Unknown quarter ${quarter}`);
  }
}

function Quarter({ quarter }: { quarter: number }) {
  const gridX = 10;
  const gridY = 20;
  return (
    <section className="flex quarter-holder">
      {/* Quarterly note */}
      <div className="quarterly-note-holder">
        <div className="period-header border-bottom">quarter {quarterHeader(quarter)}</div>
        <div className="quarterly-note-content">
          {Array.from({length: gridY}, (_, i) => (
            <div key={i} className="quarterly-note-content-row flex">
              {Array.from({length: gridX}, (_, j) => (
                <div key={j} className="quarterly-note-content-cell">
                  <div></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Months */}
      <div>
        <div className="flex">
          <div className="period-header border-bottom month-header-holder">month</div>
          <div className="flex border-bottom">
            {Array.from({ length: 31 }, (_, i) => (
              <span className="day-header-holder" key={i + 1}>{i + 1}</span>
            ))}
          </div>
        </div>
        <Month month={(quarter - 1) * 3 + 1} />
        <Month month={(quarter - 1) * 3 + 2} />
        <Month month={(quarter - 1) * 3 + 3} />
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main>
      <nav className="flex">
        <span className="page-title">YEARLY TRACKER</span>
        <span>2025</span>
      </nav>
      <Quarter quarter={1} />
      <Quarter quarter={2} />
      <Quarter quarter={3} />
      <Quarter quarter={4} />
      <footer>
        &copy; all rights reserved
      </footer>
    </main>
  );
}

type EventData = {
  start: number,
  end: number,
  name: string,
  color: string | null,
}

export default EventData;

export function createEventData(
  start: number,
  end: number,
  name: string,
  color: string | null,
) {
  return {
    start: Math.min(start, end),
    end: Math.max(start, end),
    name: name,
    color: color,
  }
}

export function eventDataContains(event: EventData, day: number) {
  return event.start <= day && day <= event.end;
}

export function eventDataDuration(event: EventData) {
  return event.end - event.start + 1;
}

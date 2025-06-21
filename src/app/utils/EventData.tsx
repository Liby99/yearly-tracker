type EventData = {
  start: number,
  end: number,
  name: string,
}

export default EventData;

export function createEventData(start: number, end: number, name: string) {
  return {
    start: Math.min(start, end),
    end: Math.max(start, end),
    name: name,
  }
}

export function eventDataContains(event: EventData, day: number) {
  return event.start <= day && day <= event.end;
}

export function eventDataDuration(event: EventData) {
  return event.end - event.start + 1;
}

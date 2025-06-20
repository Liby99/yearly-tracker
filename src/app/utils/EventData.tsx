export default class EventData {
  start: number;
  end: number;
  name: string;

  constructor(start: number, end: number, name: string) {
    this.start = Math.min(start, end);
    this.end = Math.max(start, end);
    this.name = name;
  }

  contains(day: number) {
    return this.start <= day && day <= this.end;
  }

  duration() {
    return this.end - this.start + 1;
  }
}

import { format, parseISO, isToday, isTomorrow, subDays } from 'date-fns';

export function formatTime(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'HH:mm');
}

export function formatTime12h(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'h:mm a');
}

export function formatHour(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'HH:00');
}

export function formatHour12h(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'h a');
}

export function formatDate(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'MMM d');
}

export function formatFullDate(isoString: string): string {
  const date = parseISO(isoString);
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatDayName(isoString: string): string {
  const date = parseISO(isoString);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'EEEE');
}

export function formatShortDayName(isoString: string): string {
  const date = parseISO(isoString);
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tmrw';
  return format(date, 'EEE');
}

export function getDateRangeForPastWeek(): { start: string; end: string } {
  const end = subDays(new Date(), 1);
  const start = subDays(end, 6);
  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
  };
}

export function getDateRangeForPastMonth(): { start: string; end: string } {
  const end = subDays(new Date(), 1);
  const start = subDays(end, 29);
  return {
    start: format(start, 'yyyy-MM-dd'),
    end: format(end, 'yyyy-MM-dd'),
  };
}

export function formatDateRange(startDate: string, endDate: string): string {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
}

export function getISODateString(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function getCurrentHour(): number {
  return new Date().getHours();
}

export function isCurrentHour(isoString: string): boolean {
  const date = parseISO(isoString);
  const now = new Date();
  return date.getHours() === now.getHours() && isToday(date);
}

export function getDayPeriod(hour: number): 'morning' | 'afternoon' | 'evening' | 'night' {
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}


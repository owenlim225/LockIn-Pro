import { AppData, HabitCompletion } from './types';

const CSV_HEADERS = [
  'Habit',
  'Completed Date',
  'Completed Time',
  'Notes',
  'XP Earned',
  'Recurrence',
  'Wake Time',
  'Sleep Time',
];

function escapeCsvCell(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function toDateKey(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function formatTime(date: Date | null): string {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
}

export function exportToCsv(data: AppData): string {
  const habitById = new Map(data.habits.map((h) => [h.id, h]));
  const wakeSleepByDate = new Map(data.wakeSleepLog.map((r) => [r.date, r]));

  const rows: (HabitCompletion & { habitTitle: string; recurrence: string })[] = [];
  for (const habit of data.habits) {
    for (const c of habit.completions) {
      rows.push({
        ...c,
        habitTitle: habit.title,
        recurrence: habit.recurrence,
      });
    }
  }
  rows.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());

  const lines: string[] = [];
  lines.push(CSV_HEADERS.join(','));

  if (rows.length === 0) {
    lines.push('No completions yet');
  } else {
    for (const row of rows) {
      const dateKey = toDateKey(row.completedAt);
      const dayRecord = wakeSleepByDate.get(dateKey);
      const completedDate = new Date(row.completedAt);
      const completedDateStr = completedDate.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' });
      const completedTimeStr = formatTime(row.completedAt);
      const wakeStr = dayRecord?.wakeTime ? formatTime(dayRecord.wakeTime) : '';
      const sleepStr = dayRecord?.sleepTime ? formatTime(dayRecord.sleepTime) : '';
      const cells = [
        escapeCsvCell(row.habitTitle),
        escapeCsvCell(completedDateStr),
        escapeCsvCell(completedTimeStr),
        escapeCsvCell(row.notes ?? ''),
        String(row.xpEarned),
        escapeCsvCell(row.recurrence),
        escapeCsvCell(wakeStr),
        escapeCsvCell(sleepStr),
      ];
      lines.push(cells.join(','));
    }
  }

  const csv = lines.join('\r\n');
  const BOM = '\uFEFF';
  return BOM + csv;
}

export function downloadCsv(csv: string, filename: string): void {
  if (typeof window === 'undefined') return;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function getExportFilename(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10);
  return `lockin-pro-export-${date}.csv`;
}

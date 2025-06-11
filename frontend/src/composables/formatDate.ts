import dayjs from 'dayjs';

export function formatDataWithTime(data: any): string {
  return dayjs(data).format('YYYY-MM-DD HH:mm');
}

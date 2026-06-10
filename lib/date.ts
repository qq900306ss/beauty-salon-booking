const WEEKDAYS = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'];

/** 以本地時區格式化為 YYYY-MM-DD */
export function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export interface DateOption {
  key: string; // YYYY-MM-DD
  month: number;
  day: number;
  weekday: string;
  isToday: boolean;
}

/** 取得自今日起 N 天的日期清單 */
export function getNextDays(count: number): DateOption[] {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return {
      key: toDateKey(d),
      month: d.getMonth() + 1,
      day: d.getDate(),
      weekday: WEEKDAYS[d.getDay()],
      isToday: i === 0,
    };
  });
}

/** YYYY-MM-DD → M月D日（週X） */
export function formatDateLabel(key: string): string {
  const [y, m, d] = key.split('-').map(Number);
  if (!y || !m || !d) return key;
  const date = new Date(y, m - 1, d);
  return `${m} 月 ${d} 日（${WEEKDAYS[date.getDay()]}）`;
}

/** 格式化金額 NT$1,200 */
export function formatPrice(price: number): string {
  return `NT$${price.toLocaleString('zh-Hant-TW')}`;
}

/** 分鐘 → 中文時長 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} 分鐘`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} 小時` : `${h} 小時 ${m} 分鐘`;
}

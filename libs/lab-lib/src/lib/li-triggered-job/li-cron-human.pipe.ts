import { inject,Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

interface LiCronI18n {
  everyMinute: string;
  everyNMinutes: (n: string) => string;
  everyHourAt: (minute: string) => string;
  everyNHours: (n: string) => string;
  everyDayAt: (time: string) => string;
  weekdaysAt: (time: string) => string;
  weekendsAt: (time: string) => string;
  dayRangeAt: (start: string, end: string, time: string) => string;
  daysAt: (days: string, time: string) => string;
  everyDayNameAt: (day: string, time: string) => string;
  monthlyOnDayAt: (day: string, time: string) => string;
  yearlyOnAt: (day: string, month: string, time: string) => string;
  days: string[];
  months: string[];
}

const EN: LiCronI18n = {
  everyMinute: 'Every minute',
  everyNMinutes: (n) => `Every ${n} minutes`,
  everyHourAt: (m) => `Every hour at minute ${m}`,
  everyNHours: (n) => `Every ${n} hours`,
  everyDayAt: (time) => `Every day at ${time}`,
  weekdaysAt: (time) => `Weekdays at ${time}`,
  weekendsAt: (time) => `Weekends at ${time}`,
  dayRangeAt: (start, end, time) => `${start} to ${end} at ${time}`,
  daysAt: (days, time) => `Every ${days} at ${time}`,
  everyDayNameAt: (day, time) => `Every ${day} at ${time}`,
  monthlyOnDayAt: (day, time) => `Monthly on day ${day} at ${time}`,
  yearlyOnAt: (day, month, time) => `Every year on ${month} ${day} at ${time}`,
  days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  months: [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
};

const FR: LiCronI18n = {
  everyMinute: 'Chaque minute',
  everyNMinutes: (n) => `Toutes les ${n} minutes`,
  everyHourAt: (m) => `Chaque heure à la minute ${m}`,
  everyNHours: (n) => `Toutes les ${n} heures`,
  everyDayAt: (time) => `Chaque jour à ${time}`,
  weekdaysAt: (time) => `Du lundi au vendredi à ${time}`,
  weekendsAt: (time) => `Le week-end à ${time}`,
  dayRangeAt: (start, end, time) => `Du ${start} au ${end} à ${time}`,
  daysAt: (days, time) => `Chaque ${days} à ${time}`,
  everyDayNameAt: (day, time) => `Chaque ${day} à ${time}`,
  monthlyOnDayAt: (day, time) => `Chaque mois le ${day} à ${time}`,
  yearlyOnAt: (day, month, time) => `Chaque année le ${day} ${month} à ${time}`,
  days: ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'],
  months: [
    '',
    'janvier',
    'février',
    'mars',
    'avril',
    'mai',
    'juin',
    'juillet',
    'août',
    'septembre',
    'octobre',
    'novembre',
    'décembre',
  ],
};

const I18N_MAP: Record<string, LiCronI18n> = { en: EN, fr: FR };

@Pipe({
  name: 'liCronHuman',
  standalone: true,
  pure: false,
})
export class LiCronHumanPipe implements PipeTransform {
  private translateService = inject(TranslateService);

  transform(cronExpression: string): string {
    if (!cronExpression?.trim()) {
      return '';
    }

    const parts = cronExpression.trim().split(/\s+/);
    if (parts.length !== 5) {
      return cronExpression;
    }

    const i18n = I18N_MAP[this.translateService.currentLang] || EN;
    const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;

    // Every minute: * * * * *
    if (minute === '*' && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return i18n.everyMinute;
    }

    // Every N minutes: */N * * * *
    if (minute.startsWith('*/') && hour === '*' && dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return i18n.everyNMinutes(minute.slice(2));
    }

    // Every hour: M * * * *
    if (
      minute !== '*' &&
      !minute.includes('/') &&
      hour === '*' &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return i18n.everyHourAt(this.padZero(minute));
    }

    // Every N hours: M */N * * *
    if (
      !minute.includes('*') &&
      hour.startsWith('*/') &&
      dayOfMonth === '*' &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return i18n.everyNHours(hour.slice(2));
    }

    // From here, we need a fixed time
    const time = this.formatTime(minute, hour);
    if (!time) {
      return cronExpression;
    }

    // Every day at HH:MM: M H * * *
    if (dayOfMonth === '*' && month === '*' && dayOfWeek === '*') {
      return i18n.everyDayAt(time);
    }

    // Specific day(s) of week: M H * * DOW
    if (dayOfMonth === '*' && month === '*' && dayOfWeek !== '*') {
      if (dayOfWeek === '1-5') {
        return i18n.weekdaysAt(time);
      }
      if (dayOfWeek === '0,6' || dayOfWeek === '6,0') {
        return i18n.weekendsAt(time);
      }
      if (dayOfWeek.includes('-')) {
        const [start, end] = dayOfWeek.split('-');
        const startDay = i18n.days[+start];
        const endDay = i18n.days[+end];
        if (startDay && endDay) {
          return i18n.dayRangeAt(startDay, endDay, time);
        }
      }
      if (dayOfWeek.includes(',')) {
        const days = dayOfWeek
          .split(',')
          .map((d) => i18n.days[+d])
          .filter(Boolean);
        if (days.length > 0) {
          return i18n.daysAt(days.join(', '), time);
        }
      }
      const dayName = i18n.days[+dayOfWeek];
      if (dayName) {
        return i18n.everyDayNameAt(dayName, time);
      }
    }

    // Monthly: M H DOM * *
    if (
      dayOfMonth !== '*' &&
      !dayOfMonth.includes('/') &&
      !dayOfMonth.includes(',') &&
      month === '*' &&
      dayOfWeek === '*'
    ) {
      return i18n.monthlyOnDayAt(dayOfMonth, time);
    }

    // Yearly: M H DOM MON *
    if (
      dayOfMonth !== '*' &&
      month !== '*' &&
      !month.includes('/') &&
      !month.includes(',') &&
      dayOfWeek === '*'
    ) {
      const monthName = i18n.months[+month];
      if (monthName) {
        return i18n.yearlyOnAt(dayOfMonth, monthName, time);
      }
    }

    return cronExpression;
  }

  private formatTime(minute: string, hour: string): string | null {
    const m = parseInt(minute, 10);
    const h = parseInt(hour, 10);
    if (isNaN(m) || isNaN(h)) {
      return null;
    }
    return `${this.padZero(h)}:${this.padZero(m)}`;
  }

  private padZero(value: string | number): string {
    return String(value).padStart(2, '0');
  }
}

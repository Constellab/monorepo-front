import { inject, Pipe, PipeTransform } from '@angular/core';
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

interface LiCronParts {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

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

    return this.describeCron({ minute, hour, dayOfMonth, month, dayOfWeek }, i18n) ?? cronExpression;
  }

  /**
   * Describe the cron expression, null when it does not match any known pattern
   */
  private describeCron(cron: LiCronParts, i18n: LiCronI18n): string | null {
    const recurring = this.describeRecurring(cron, i18n);
    if (recurring != null) {
      return recurring;
    }

    // From here, we need a fixed time
    const time = this.formatTime(cron.minute, cron.hour);
    if (time == null) {
      return null;
    }

    return this.describeAtFixedTime(cron, i18n, time);
  }

  // patterns repeating on every date: every minute, every N minutes, hourly, every N hours
  private describeRecurring(cron: LiCronParts, i18n: LiCronI18n): string | null {
    const { minute, hour, dayOfMonth, month, dayOfWeek } = cron;

    if (dayOfMonth !== '*' || month !== '*' || dayOfWeek !== '*') {
      return null;
    }

    // Every N hours: M */N * * *
    if (hour !== '*') {
      return !minute.includes('*') && hour.startsWith('*/') ? i18n.everyNHours(hour.slice(2)) : null;
    }

    // Every minute: * * * * *
    if (minute === '*') {
      return i18n.everyMinute;
    }
    // Every N minutes: */N * * * *
    if (minute.startsWith('*/')) {
      return i18n.everyNMinutes(minute.slice(2));
    }
    // Every hour: M * * * *
    if (!minute.includes('/')) {
      return i18n.everyHourAt(this.padZero(minute));
    }
    return null;
  }

  // patterns happening at a fixed time of day
  private describeAtFixedTime(cron: LiCronParts, i18n: LiCronI18n, time: string): string | null {
    const { dayOfMonth, month, dayOfWeek } = cron;

    if (dayOfMonth === '*' && month === '*') {
      // Every day at HH:MM: M H * * *
      if (dayOfWeek === '*') {
        return i18n.everyDayAt(time);
      }
      // Specific day(s) of week: M H * * DOW
      return this.describeDayOfWeek(dayOfWeek, i18n, time);
    }

    return this.describeDayOfMonth(cron, i18n, time);
  }

  private describeDayOfWeek(dayOfWeek: string, i18n: LiCronI18n, time: string): string | null {
    if (dayOfWeek === '1-5') {
      return i18n.weekdaysAt(time);
    }
    if (dayOfWeek === '0,6' || dayOfWeek === '6,0') {
      return i18n.weekendsAt(time);
    }

    return (
      this.describeDayOfWeekRange(dayOfWeek, i18n, time) ??
      this.describeDayOfWeekList(dayOfWeek, i18n, time) ??
      this.describeSingleDayOfWeek(dayOfWeek, i18n, time)
    );
  }

  private describeDayOfWeekRange(dayOfWeek: string, i18n: LiCronI18n, time: string): string | null {
    if (!dayOfWeek.includes('-')) {
      return null;
    }
    const [start, end] = dayOfWeek.split('-');
    const startDay = i18n.days[+start];
    const endDay = i18n.days[+end];
    return startDay && endDay ? i18n.dayRangeAt(startDay, endDay, time) : null;
  }

  private describeDayOfWeekList(dayOfWeek: string, i18n: LiCronI18n, time: string): string | null {
    if (!dayOfWeek.includes(',')) {
      return null;
    }
    const days = dayOfWeek
      .split(',')
      .map((d) => i18n.days[+d])
      .filter(Boolean);
    return days.length > 0 ? i18n.daysAt(days.join(', '), time) : null;
  }

  private describeSingleDayOfWeek(dayOfWeek: string, i18n: LiCronI18n, time: string): string | null {
    const dayName = i18n.days[+dayOfWeek];
    return dayName ? i18n.everyDayNameAt(dayName, time) : null;
  }

  // monthly (M H DOM * *) and yearly (M H DOM MON *) patterns
  private describeDayOfMonth(cron: LiCronParts, i18n: LiCronI18n, time: string): string | null {
    const { dayOfMonth, month, dayOfWeek } = cron;

    // both patterns need a fixed day of month and no day of week
    if (dayOfMonth === '*' || dayOfWeek !== '*') {
      return null;
    }

    // Monthly: M H DOM * *
    if (month === '*') {
      return this.isSingleValue(dayOfMonth) ? i18n.monthlyOnDayAt(dayOfMonth, time) : null;
    }

    // Yearly: M H DOM MON *
    if (!this.isSingleValue(month)) {
      return null;
    }
    const monthName = i18n.months[+month];
    return monthName ? i18n.yearlyOnAt(dayOfMonth, monthName, time) : null;
  }

  // a cron field holding a single value, not a list nor a step
  private isSingleValue(cronField: string): boolean {
    return !cronField.includes('/') && !cronField.includes(',');
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

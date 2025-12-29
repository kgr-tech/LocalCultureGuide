import { TimeOfDay } from '../models/types';

export class TimeManager {
  /**
   * Get current time of day based on hour
   * Morning: 5 AM - 11:59 AM
   * Afternoon: 12 PM - 5:59 PM
   * Evening: 6 PM - 4:59 AM
   */
  getCurrentTimeOfDay(date: Date = new Date()): TimeOfDay {
    const hour = date.getHours();

    if (hour >= 5 && hour < 12) {
      return TimeOfDay.Morning;
    } else if (hour >= 12 && hour < 18) {
      return TimeOfDay.Afternoon;
    } else {
      return TimeOfDay.Evening;
    }
  }

  /**
   * Check if current time is within peak hours
   * Peak hours: 8:00-10:00 AM and 5:30-7:30 PM
   */
  isPeakHour(date: Date = new Date()): boolean {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const timeInMinutes = hour * 60 + minute;

    // Morning peak: 8:00 AM (480 min) to 10:00 AM (600 min)
    const morningPeakStart = 8 * 60; // 480
    const morningPeakEnd = 10 * 60; // 600

    // Evening peak: 5:30 PM (1050 min) to 7:30 PM (1170 min)
    const eveningPeakStart = 17 * 60 + 30; // 1050
    const eveningPeakEnd = 19 * 60 + 30; // 1170

    return (
      (timeInMinutes >= morningPeakStart && timeInMinutes < morningPeakEnd) ||
      (timeInMinutes >= eveningPeakStart && timeInMinutes < eveningPeakEnd)
    );
  }

  /**
   * Get peak hour multiplier for traffic calculations
   * Returns 1.0 for non-peak hours, route-specific multiplier for peak hours
   */
  getPeakHourMultiplier(routeMultiplier: number, date: Date = new Date()): number {
    return this.isPeakHour(date) ? routeMultiplier : 1.0;
  }

  /**
   * Calculate estimated travel time with peak hour adjustment
   */
  calculateTravelTime(baseTime: number, peakMultiplier: number, date: Date = new Date()): number {
    const multiplier = this.getPeakHourMultiplier(peakMultiplier, date);
    return Math.round(baseTime * multiplier);
  }

  /**
   * Get peak hour warning message
   */
  getPeakHourWarning(date: Date = new Date()): string | null {
    if (!this.isPeakHour(date)) {
      return null;
    }

    const hour = date.getHours();
    if (hour >= 8 && hour < 10) {
      return '⚠️ Morning peak hours (8-10 AM) - Expect heavy traffic';
    } else {
      return '⚠️ Evening peak hours (5:30-7:30 PM) - Expect heavy traffic';
    }
  }

  /**
   * Format time of day for display
   */
  formatTimeOfDay(timeOfDay: TimeOfDay): string {
    const map: Record<TimeOfDay, string> = {
      [TimeOfDay.Morning]: '🌅 Morning',
      [TimeOfDay.Afternoon]: '☀️ Afternoon',
      [TimeOfDay.Evening]: '🌙 Evening'
    };
    return map[timeOfDay];
  }

  /**
   * Get all times of day
   */
  getAllTimesOfDay(): TimeOfDay[] {
    return [TimeOfDay.Morning, TimeOfDay.Afternoon, TimeOfDay.Evening];
  }
}

// Export singleton instance
export const timeManager = new TimeManager();

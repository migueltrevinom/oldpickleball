import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VenueService, TimeSlot } from '../../../core/services/venue.service';

interface CalendarDay {
  date: Date;
  label: string;
  dayName: string;
  iso: string;
  isToday: boolean;
}

@Component({
  selector: 'app-booking-calendar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Back button -->
      <button (click)="goBack()" class="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to venue
      </button>

      <!-- Header Card -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <svg class="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-heading font-bold text-gray-900">Book a Court</h1>
            <p class="text-sm text-gray-500">{{ courtName || 'Select a time slot' }}</p>
          </div>
        </div>
      </div>

      <!-- Date Picker Strip -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Select Date</h2>
        <div class="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          @for (day of calendarDays; track day.iso) {
            <button
              (click)="selectDate(day)"
              class="flex flex-col items-center py-3 px-3 rounded-xl border-2 transition-all shrink-0"
              [style.min-width]="'4.5rem'"
              [ngClass]="selectedDate() === day.iso
                ? 'border-primary bg-primary text-white'
                : 'border-gray-100 bg-white hover:border-green-300'"
            >
              <span class="text-xs font-medium"
                [ngClass]="selectedDate() === day.iso ? 'text-white/70' : 'text-gray-500'">
                {{ day.dayName }}
              </span>
              <span class="text-lg font-bold mt-0.5"
                [ngClass]="selectedDate() === day.iso ? '' : 'text-gray-900'">
                {{ day.label }}
              </span>
              @if (day.isToday) {
                <span class="font-medium mt-0.5"
                  [style.font-size]="'10px'"
                  [ngClass]="selectedDate() === day.iso ? 'text-green-100' : 'text-primary'">
                  Today
                </span>
              }
            </button>
          }
        </div>
      </div>

      <!-- Time Slots -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Available Times</h2>

        @if (loadingSlots()) {
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="h-12 bg-gray-100 rounded-xl animate-pulse"></div>
            }
          </div>
        }

        @if (!loadingSlots() && availableSlots().length > 0) {
          <div class="grid grid-cols-3 sm:grid-cols-4 gap-3">
            @for (slot of availableSlots(); track slot.startTime) {
              <button
                (click)="slot.available ? selectSlot(slot) : null"
                class="py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all"
                [ngClass]="getSlotClasses(slot)"
              >
                {{ formatTime(slot.startTime) }}
              </button>
            }
          </div>
        }

        @if (!loadingSlots() && availableSlots().length === 0) {
          <div class="text-center py-8">
            <div class="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <p class="text-gray-500 text-sm">No available slots for this date.</p>
            <p class="text-gray-400 text-xs mt-1">Try selecting a different date.</p>
          </div>
        }
      </div>

      <!-- Confirmation Panel -->
      @if (selectedSlot()) {
        <div class="bg-white rounded-2xl shadow-sm border-2 border-primary/20 p-6">
          <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Booking Summary</h2>

          <!-- Duration Selector -->
          <div class="mb-5">
            <label class="text-sm font-medium text-gray-700 block mb-2">Duration</label>
            <div class="flex gap-2">
              @for (dur of durations; track dur.value) {
                <button
                  (click)="selectDuration(dur.value)"
                  class="px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all"
                  [ngClass]="selectedDuration() === dur.value
                    ? 'border-primary bg-green-50 text-primary'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'"
                >
                  {{ dur.label }}
                </button>
              }
            </div>
          </div>

          <!-- Summary Details -->
          <div class="space-y-3 mb-6">
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Date</span>
              <span class="font-medium text-gray-900">{{ formatSelectedDate() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Time</span>
              <span class="font-medium text-gray-900">{{ formatTime(selectedSlot()!.startTime) }} – {{ computedEndTime() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-500">Duration</span>
              <span class="font-medium text-gray-900">{{ selectedDurationLabel() }}</span>
            </div>
            <div class="border-t border-gray-100 pt-3 flex justify-between">
              <span class="font-medium text-gray-700">Total</span>
              <span class="text-xl font-bold text-primary">\${{ totalPrice() }}</span>
            </div>
          </div>

          <!-- Book Button -->
          <button
            (click)="confirmBooking()"
            [disabled]="booking()"
            class="w-full py-3.5 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            @if (booking()) {
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Booking...
            } @else {
              Confirm Booking
            }
          </button>

          @if (bookingError()) {
            <p class="text-red-500 text-sm text-center mt-3">{{ bookingError() }}</p>
          }
        </div>
      }

      <!-- Success -->
      @if (bookingSuccess()) {
        <div class="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
          <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
            </svg>
          </div>
          <h3 class="text-lg font-heading font-semibold text-green-900">Booking Confirmed!</h3>
          <p class="text-green-700 text-sm mt-2">Your court has been booked successfully.</p>
          <button
            (click)="goToBookings()"
            class="mt-4 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors text-sm"
          >
            View My Bookings
          </button>
        </div>
      }
    </div>
  `,
})
export class BookingCalendarComponent implements OnInit {
  venueId = '';
  courtId = '';
  courtName = '';
  pricePerHour = 0;

  calendarDays: CalendarDay[] = [];
  selectedDate = signal('');
  availableSlots = signal<TimeSlot[]>([]);
  loadingSlots = signal(false);
  selectedSlot = signal<TimeSlot | null>(null);
  selectedDuration = signal(60);
  booking = signal(false);
  bookingSuccess = signal(false);
  bookingError = signal('');

  readonly durations = [
    { label: '30 min', value: 30 },
    { label: '1 hr', value: 60 },
    { label: '1.5 hr', value: 90 },
    { label: '2 hr', value: 120 },
  ];

  computedEndTime = computed(() => {
    const slot = this.selectedSlot();
    if (!slot) return '';
    return this.addMinutesToTime(slot.startTime, this.selectedDuration());
  });

  totalPrice = computed(() => {
    return ((this.selectedDuration() / 60) * this.pricePerHour).toFixed(2);
  });

  selectedDurationLabel = computed(() => {
    const dur = this.durations.find((d) => d.value === this.selectedDuration());
    return dur?.label ?? '';
  });

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private venueService: VenueService,
  ) {}

  ngOnInit(): void {
    this.venueId = this.route.snapshot.paramMap.get('venueId') ?? '';
    this.courtId = this.route.snapshot.paramMap.get('courtId') ?? '';
    this.pricePerHour = Number(this.route.snapshot.queryParamMap.get('price')) || 0;
    this.courtName = this.route.snapshot.queryParamMap.get('name') ?? '';

    this.generateCalendarDays();
    if (this.calendarDays.length > 0) {
      this.selectDate(this.calendarDays[0]);
    }
  }

  selectDate(day: CalendarDay): void {
    this.selectedDate.set(day.iso);
    this.selectedSlot.set(null);
    this.bookingSuccess.set(false);
    this.bookingError.set('');
    this.loadSlots(day.iso);
  }

  selectSlot(slot: TimeSlot): void {
    this.selectedSlot.set(slot);
    this.bookingError.set('');
  }

  selectDuration(minutes: number): void {
    this.selectedDuration.set(minutes);
  }

  confirmBooking(): void {
    const slot = this.selectedSlot();
    if (!slot) return;

    this.booking.set(true);
    this.bookingError.set('');

    const endTime = this.addMinutesToTime(slot.startTime, this.selectedDuration());

    this.venueService.bookCourt(this.venueId, this.courtId, {
      courtId: this.courtId,
      date: this.selectedDate(),
      startTime: slot.startTime,
      endTime,
    }).subscribe({
      next: () => {
        this.booking.set(false);
        this.bookingSuccess.set(true);
        this.selectedSlot.set(null);
      },
      error: (err) => {
        this.booking.set(false);
        const msg = err?.error?.message || 'Booking failed. Please try again.';
        this.bookingError.set(msg);
      },
    });
  }

  getSlotClasses(slot: TimeSlot): string {
    if (!slot.available) {
      return 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed';
    }
    if (this.selectedSlot()?.startTime === slot.startTime) {
      return 'border-primary bg-primary text-white';
    }
    return 'border-green-200 bg-green-50 text-green-700 hover:border-green-400';
  }

  formatTime(time: string): string {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  formatSelectedDate(): string {
    const dateStr = this.selectedDate();
    if (!dateStr) return '';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  goBack(): void {
    this.router.navigate(['/courts', this.venueId]);
  }

  goToBookings(): void {
    this.router.navigate(['/bookings']);
  }

  private generateCalendarDays(): void {
    const today = new Date();
    this.calendarDays = Array.from({ length: 14 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return {
        date,
        label: date.getDate().toString(),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        iso: this.toISODate(date),
        isToday: i === 0,
      };
    });
  }

  private loadSlots(date: string): void {
    this.loadingSlots.set(true);
    this.venueService.getCourtAvailability(this.venueId, this.courtId, date).subscribe({
      next: (slots) => {
        this.availableSlots.set(slots);
        this.loadingSlots.set(false);
      },
      error: () => {
        this.availableSlots.set([]);
        this.loadingSlots.set(false);
      },
    });
  }

  private addMinutesToTime(time: string, minutes: number): string {
    const [h, m] = time.split(':').map(Number);
    const totalMinutes = h * 60 + m + minutes;
    const newH = Math.floor(totalMinutes / 60) % 24;
    const newM = totalMinutes % 60;
    return `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
  }

  private toISODate(date: Date): string {
    const y = date.getFullYear();
    const m = (date.getMonth() + 1).toString().padStart(2, '0');
    const d = date.getDate().toString().padStart(2, '0');
    return `${y}-${m}-${d}`;
  }
}

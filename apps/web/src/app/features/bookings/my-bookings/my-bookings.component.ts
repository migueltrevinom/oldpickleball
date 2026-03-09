import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VenueService, Booking } from '../../../core/services/venue.service';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-heading font-bold text-gray-900">My Bookings</h1>
          <p class="text-gray-500 mt-1">Manage your court reservations</p>
        </div>
        <button
          (click)="goToCourtFinder()"
          class="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors text-sm"
        >
          Book a Court
        </button>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="space-y-4">
          @for (i of [1,2,3]; track i) {
            <div class="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div class="flex gap-4">
                <div class="w-16 h-16 bg-gray-200 rounded-xl"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-5 bg-gray-200 rounded w-1/3"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div class="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          }
        </div>
      }

      @if (!loading()) {
        <!-- Upcoming Bookings -->
        @if (upcomingBookings().length > 0) {
          <div>
            <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Upcoming</h2>
            <div class="space-y-3">
              @for (booking of upcomingBookings(); track booking._id) {
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                  <div class="flex items-start justify-between gap-4">
                    <div class="flex gap-4">
                      <div class="w-14 h-14 bg-primary/10 rounded-xl flex flex-col items-center justify-center shrink-0">
                        <span class="text-xs font-medium text-primary">{{ getMonth(booking.date) }}</span>
                        <span class="text-lg font-bold text-primary leading-tight">{{ getDay(booking.date) }}</span>
                      </div>
                      <div>
                        <h3 class="font-medium text-gray-900">{{ booking.venueName || 'Venue' }}</h3>
                        <p class="text-sm text-gray-500">{{ booking.courtName || 'Court' }}</p>
                        <div class="flex items-center gap-3 mt-1.5 text-sm text-gray-600">
                          <span class="flex items-center gap-1">
                            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                            {{ formatTime(booking.startTime) }} – {{ formatTime(booking.endTime) }}
                          </span>
                          @if (booking.price) {
                            <span class="text-primary font-medium">\${{ booking.price }}</span>
                          }
                        </div>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="px-2.5 py-1 text-xs font-medium rounded-full"
                        [class.bg-green-100]="booking.status === 'confirmed'"
                        [class.text-green-700]="booking.status === 'confirmed'"
                        [class.bg-yellow-100]="booking.status === 'pending'"
                        [class.text-yellow-700]="booking.status === 'pending'"
                        [class.bg-gray-100]="!booking.status || (booking.status !== 'confirmed' && booking.status !== 'pending')"
                        [class.text-gray-600]="!booking.status || (booking.status !== 'confirmed' && booking.status !== 'pending')"
                      >
                        {{ (booking.status || 'confirmed') | titlecase }}
                      </span>
                      <button
                        (click)="cancelBooking(booking)"
                        [disabled]="cancelling() === booking._id"
                        class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Cancel booking"
                      >
                        @if (cancelling() === booking._id) {
                          <svg class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                        } @else {
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                          </svg>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Past Bookings -->
        @if (pastBookings().length > 0) {
          <div>
            <h2 class="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Past</h2>
            <div class="space-y-3">
              @for (booking of pastBookings(); track booking._id) {
                <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 opacity-70">
                  <div class="flex items-start gap-4">
                    <div class="w-14 h-14 bg-gray-100 rounded-xl flex flex-col items-center justify-center shrink-0">
                      <span class="text-xs font-medium text-gray-500">{{ getMonth(booking.date) }}</span>
                      <span class="text-lg font-bold text-gray-600 leading-tight">{{ getDay(booking.date) }}</span>
                    </div>
                    <div>
                      <h3 class="font-medium text-gray-700">{{ booking.venueName || 'Venue' }}</h3>
                      <p class="text-sm text-gray-500">{{ booking.courtName || 'Court' }}</p>
                      <div class="flex items-center gap-3 mt-1.5 text-sm text-gray-500">
                        <span>{{ formatTime(booking.startTime) }} – {{ formatTime(booking.endTime) }}</span>
                        @if (booking.price) {
                          <span>\${{ booking.price }}</span>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }

        <!-- Empty State -->
        @if (upcomingBookings().length === 0 && pastBookings().length === 0) {
          <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 class="text-lg font-heading font-semibold text-gray-900">No bookings yet</h3>
            <p class="text-gray-500 mt-2 text-sm">Find a court and make your first booking!</p>
            <button
              (click)="goToCourtFinder()"
              class="mt-4 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors text-sm"
            >
              Find a Court
            </button>
          </div>
        }
      }

      <!-- Cancel Confirmation Dialog -->
      @if (showCancelDialog()) {
        <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 class="text-lg font-heading font-semibold text-gray-900">Cancel Booking?</h3>
            <p class="text-gray-500 text-sm mt-2">This action cannot be undone. Are you sure you want to cancel this booking?</p>
            <div class="flex gap-3 mt-6">
              <button
                (click)="showCancelDialog.set(false)"
                class="flex-1 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
              >
                Keep Booking
              </button>
              <button
                (click)="confirmCancel()"
                class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors text-sm"
              >
                Cancel Booking
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class MyBookingsComponent implements OnInit {
  allBookings = signal<Booking[]>([]);
  loading = signal(true);
  cancelling = signal('');
  showCancelDialog = signal(false);
  private bookingToCancel: Booking | null = null;

  upcomingBookings = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.allBookings()
      .filter((b) => b.date >= today && b.status !== 'cancelled')
      .sort((a, b) => a.date.localeCompare(b.date));
  });

  pastBookings = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return this.allBookings()
      .filter((b) => b.date < today || b.status === 'cancelled')
      .sort((a, b) => b.date.localeCompare(a.date));
  });

  constructor(
    private venueService: VenueService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  cancelBooking(booking: Booking): void {
    this.bookingToCancel = booking;
    this.showCancelDialog.set(true);
  }

  confirmCancel(): void {
    if (!this.bookingToCancel) return;
    const id = this.bookingToCancel._id;
    this.showCancelDialog.set(false);
    this.cancelling.set(id);

    this.venueService.cancelBooking(id).subscribe({
      next: () => {
        this.allBookings.update((bookings) =>
          bookings.map((b) => (b._id === id ? { ...b, status: 'cancelled' } : b))
        );
        this.cancelling.set('');
        this.bookingToCancel = null;
      },
      error: () => {
        this.cancelling.set('');
        this.bookingToCancel = null;
      },
    });
  }

  goToCourtFinder(): void {
    this.router.navigate(['/courts']);
  }

  formatTime(time: string): string {
    if (!time) return '';
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
  }

  getMonth(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  }

  getDay(dateStr: string): string {
    const date = new Date(dateStr + 'T00:00:00');
    return date.getDate().toString();
  }

  private loadBookings(): void {
    this.venueService.getMyBookings().subscribe({
      next: (bookings) => {
        this.allBookings.set(bookings);
        this.loading.set(false);
      },
      error: () => {
        this.allBookings.set([]);
        this.loading.set(false);
      },
    });
  }
}

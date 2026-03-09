import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VenueService, Venue, Court } from '../../../core/services/venue.service';

@Component({
  selector: 'app-venue-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Loading -->
    @if (loading()) {
      <div class="space-y-6 animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-4">
            <div class="bg-white rounded-2xl h-64"></div>
            <div class="bg-white rounded-2xl h-48"></div>
          </div>
          <div class="bg-white rounded-2xl h-64"></div>
        </div>
      </div>
    }

    @if (!loading() && venue()) {
      <div class="space-y-6">
        <!-- Back button -->
        <button (click)="goBack()" class="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to courts
        </button>

        <!-- Venue Header -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <h1 class="text-2xl font-heading font-bold text-gray-900">{{ venue()!.name }}</h1>
              <p class="text-gray-500 mt-1 flex items-center gap-1.5">
                <svg class="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                {{ venue()!.address }}, {{ venue()!.city }}, {{ venue()!.state }} {{ venue()!.zip }}
              </p>
              @if (venue()!.description) {
                <p class="text-gray-600 mt-3 text-sm leading-relaxed">{{ venue()!.description }}</p>
              }
            </div>
            @if (venue()!.rating) {
              <div class="flex items-center gap-2 bg-yellow-50 px-3 py-1.5 rounded-xl shrink-0">
                <svg class="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span class="font-semibold text-gray-700">{{ venue()!.rating }}</span>
                @if (venue()!.reviewCount) {
                  <span class="text-sm text-gray-500">({{ venue()!.reviewCount }} reviews)</span>
                }
              </div>
            }
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Amenities -->
            @if (venue()!.amenities?.length) {
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Amenities</h2>
                <div class="flex flex-wrap gap-2">
                  @for (amenity of venue()!.amenities!; track amenity) {
                    <span class="px-3 py-1.5 bg-primary/5 text-primary text-sm rounded-xl font-medium flex items-center gap-1.5">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                      {{ amenity }}
                    </span>
                  }
                </div>
              </div>
            }

            <!-- Courts -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">
                Available Courts
                <span class="text-sm font-normal text-gray-500 ml-2">({{ venue()!.courts?.length || 0 }})</span>
              </h2>
              @if (venue()!.courts?.length) {
                <div class="space-y-3">
                  @for (court of venue()!.courts!; track court._id) {
                    <div class="border border-gray-100 rounded-xl p-4 hover:border-primary/20 transition-all">
                      <div class="flex items-center justify-between">
                        <div>
                          <h3 class="font-medium text-gray-900">{{ court.name }}</h3>
                          <div class="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            @if (court.surface) {
                              <span class="flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                                </svg>
                                {{ court.surface }}
                              </span>
                            }
                            @if (court.environment) {
                              <span class="flex items-center gap-1">
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                                </svg>
                                {{ court.environment }}
                              </span>
                            }
                          </div>
                        </div>
                        <div class="text-right">
                          <p class="text-lg font-bold text-primary">\${{ court.pricePerHour }}<span class="text-xs font-normal text-gray-500">/hr</span></p>
                          <button
                            (click)="bookCourt(court)"
                            class="mt-2 px-4 py-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              } @else {
                <div class="text-center py-8">
                  <p class="text-gray-500">No courts available at this venue.</p>
                </div>
              }
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Operating Hours -->
            @if (venue()!.hours) {
              <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Operating Hours</h2>
                <div class="space-y-2">
                  @for (day of dayNames; track day) {
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 font-medium">{{ day }}</span>
                      @if (getHoursForDay(day); as hours) {
                        <span class="text-gray-900">{{ hours }}</span>
                      } @else {
                        <span class="text-gray-400">Closed</span>
                      }
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Contact Info -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Contact</h2>
              <div class="space-y-3">
                @if (venue()!.phone) {
                  <div class="flex items-center gap-3 text-sm">
                    <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <span class="text-gray-700">{{ venue()!.phone }}</span>
                  </div>
                }
                @if (venue()!.email) {
                  <div class="flex items-center gap-3 text-sm">
                    <svg class="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                    </svg>
                    <span class="text-gray-700">{{ venue()!.email }}</span>
                  </div>
                }
                <div class="flex items-start gap-3 text-sm">
                  <svg class="w-4 h-4 text-gray-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  <span class="text-gray-700">{{ venue()!.address }}<br/>{{ venue()!.city }}, {{ venue()!.state }} {{ venue()!.zip }}</span>
                </div>
              </div>
            </div>

            <!-- Access Info -->
            @if (venue()!.accessType || venue()!.registrationFee) {
              <div class="bg-peach rounded-2xl border border-orange-100 p-6">
                <h2 class="text-lg font-heading font-semibold text-gray-900 mb-3">Access Info</h2>
                @if (venue()!.accessType) {
                  <p class="text-sm text-gray-600"><span class="font-medium">Access:</span> {{ venue()!.accessType }}</p>
                }
                @if (venue()!.registrationFee) {
                  <p class="text-sm text-gray-600 mt-1"><span class="font-medium">Registration Fee:</span> \${{ venue()!.registrationFee }}</p>
                }
              </div>
            }
          </div>
        </div>
      </div>
    }

    <!-- Not found -->
    @if (!loading() && !venue()) {
      <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
        <div class="text-4xl mb-4">🏟️</div>
        <h3 class="text-lg font-heading font-semibold text-gray-900">Venue not found</h3>
        <p class="text-gray-500 mt-2 text-sm">This venue may have been removed or doesn't exist.</p>
        <button (click)="goBack()" class="mt-4 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors text-sm">
          Browse Courts
        </button>
      </div>
    }
  `,
})
export class VenueDetailComponent implements OnInit {
  venue = signal<Venue | null>(null);
  loading = signal(true);

  readonly dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private venueService: VenueService,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.venueService.getVenue(id).subscribe({
        next: (venue) => {
          this.venue.set(venue);
          this.loading.set(false);
        },
        error: () => {
          this.venue.set(null);
          this.loading.set(false);
        },
      });
    } else {
      this.loading.set(false);
    }
  }

  getHoursForDay(day: string): string {
    const hours = this.venue()?.hours;
    if (!hours) return '';
    const key = day.toLowerCase();
    const dayHours = hours[key];
    if (!dayHours || dayHours.closed) return '';
    return `${dayHours.open} – ${dayHours.close}`;
  }

  bookCourt(court: Court): void {
    const venueId = this.venue()?._id;
    if (venueId) {
      this.router.navigate(['/courts', venueId, 'book', court._id], {
        queryParams: { price: court.pricePerHour, name: court.name },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/courts']);
  }
}

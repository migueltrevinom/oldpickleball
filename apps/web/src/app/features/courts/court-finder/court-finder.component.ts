import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { VenueService, Venue } from '../../../core/services/venue.service';

@Component({
  selector: 'app-court-finder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-heading font-bold text-gray-900">Find a Court</h1>
        <p class="text-gray-500 mt-1">Discover and book pickleball courts near you</p>
      </div>

      <!-- Search Bar -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (keyup.enter)="onSearch()"
              placeholder="Search by city, zip code, or venue name..."
              class="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <button
            (click)="onSearch()"
            class="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors text-sm whitespace-nowrap"
          >
            Search Courts
          </button>
        </div>
      </div>

      <!-- Loading State -->
      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
              <div class="h-40 bg-gray-200 rounded-xl mb-4"></div>
              <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
              <div class="flex gap-2">
                <div class="h-6 bg-gray-200 rounded-full w-16"></div>
                <div class="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Venues Grid -->
      @if (!loading() && venues().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          @for (venue of venues(); track venue._id) {
            <button
              (click)="goToVenue(venue._id)"
              class="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all text-left group overflow-hidden"
            >
              <!-- Image/Placeholder -->
              <div class="h-40 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <svg class="w-12 h-12 text-primary/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div class="p-5">
                <div class="flex items-start justify-between gap-2">
                  <h3 class="font-heading font-semibold text-gray-900 group-hover:text-primary transition-colors">{{ venue.name }}</h3>
                  @if (venue.rating) {
                    <div class="flex items-center gap-1 text-sm shrink-0">
                      <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                      </svg>
                      <span class="font-medium text-gray-700">{{ venue.rating }}</span>
                    </div>
                  }
                </div>
                <p class="text-sm text-gray-500 mt-1 flex items-center gap-1">
                  <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                  </svg>
                  {{ venue.address }}, {{ venue.city }}, {{ venue.state }}
                </p>

                <div class="flex items-center gap-3 mt-3 text-sm text-gray-600">
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                    </svg>
                    {{ venue.courts?.length || 0 }} courts
                  </span>
                  @if (getPriceRange(venue); as priceRange) {
                    <span class="text-primary font-medium">{{ priceRange }}</span>
                  }
                </div>

                <!-- Amenities -->
                @if (venue.amenities && venue.amenities.length > 0) {
                  <div class="flex flex-wrap gap-1.5 mt-3">
                    @for (amenity of venue.amenities!.slice(0, 3); track amenity) {
                      <span class="px-2 py-0.5 bg-primary/5 text-primary text-xs rounded-full font-medium">
                        {{ amenity }}
                      </span>
                    }
                    @if (venue.amenities!.length > 3) {
                      <span class="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-full">
                        +{{ venue.amenities!.length - 3 }}
                      </span>
                    }
                  </div>
                }
              </div>
            </button>
          }
        </div>
      }

      <!-- Empty State -->
      @if (!loading() && venues().length === 0) {
        <div class="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <h3 class="text-lg font-heading font-semibold text-gray-900">No venues found</h3>
          <p class="text-gray-500 mt-2 text-sm">Try adjusting your search or check back later for new venues.</p>
        </div>
      }
    </div>
  `,
})
export class CourtFinderComponent implements OnInit {
  searchQuery = '';
  venues = signal<Venue[]>([]);
  loading = signal(true);

  constructor(
    private venueService: VenueService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadVenues();
  }

  onSearch(): void {
    this.loadVenues();
  }

  goToVenue(id: string): void {
    this.router.navigate(['/courts', id]);
  }

  getPriceRange(venue: Venue): string {
    if (!venue.courts?.length) return '';
    const prices = venue.courts.map((c) => c.pricePerHour).filter((p) => p > 0);
    if (!prices.length) return '';
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    if (min === max) return `$${min}/hr`;
    return `$${min}–$${max}/hr`;
  }

  private loadVenues(): void {
    this.loading.set(true);
    const params: Record<string, string> = {};
    if (this.searchQuery.trim()) {
      params['search'] = this.searchQuery.trim();
    }
    this.venueService.searchVenues(params).subscribe({
      next: (venues) => {
        this.venues.set(venues);
        this.loading.set(false);
      },
      error: () => {
        this.venues.set([]);
        this.loading.set(false);
      },
    });
  }
}

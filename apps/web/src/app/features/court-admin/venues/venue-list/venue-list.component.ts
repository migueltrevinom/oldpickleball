import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { VenueService, Venue } from '../../../../core/services/venue.service';

@Component({
  selector: 'app-venue-list',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-heading font-bold text-gray-900">My Venues</h1>
          <p class="text-gray-500 mt-1">Manage your pickleball venues and courts</p>
        </div>
        <button
          (click)="createVenue()"
          class="px-4 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors text-sm flex items-center gap-2"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
          </svg>
          Create Venue
        </button>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          @for (i of [1,2,3,4]; track i) {
            <div class="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div class="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div class="flex gap-2">
                <div class="h-6 bg-gray-200 rounded-full w-20"></div>
                <div class="h-6 bg-gray-200 rounded-full w-16"></div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Venues -->
      @if (!loading() && venues().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          @for (venue of venues(); track venue._id) {
            <button
              (click)="manageVenue(venue._id)"
              class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-left hover:shadow-md hover:border-primary/20 transition-all group"
            >
              <div class="flex items-start justify-between">
                <div>
                  <h3 class="font-heading font-semibold text-gray-900 group-hover:text-primary transition-colors">{{ venue.name }}</h3>
                  <p class="text-sm text-gray-500 mt-1">{{ venue.address }}, {{ venue.city }}, {{ venue.state }}</p>
                </div>
                <span
                  class="px-2.5 py-1 text-xs font-medium rounded-full shrink-0"
                  [class.bg-green-100]="venue.isActive !== false"
                  [class.text-green-700]="venue.isActive !== false"
                  [class.bg-gray-100]="venue.isActive === false"
                  [class.text-gray-500]="venue.isActive === false"
                >
                  {{ venue.isActive !== false ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="flex items-center gap-4 mt-4 text-sm text-gray-600">
                <span class="flex items-center gap-1">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/>
                  </svg>
                  {{ venue.courts?.length || 0 }} courts
                </span>
                @if (venue.rating) {
                  <span class="flex items-center gap-1">
                    <svg class="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                    {{ venue.rating }}
                  </span>
                }
              </div>
              <div class="mt-3 flex items-center gap-1 text-xs text-primary font-medium group-hover:translate-x-1 transition-transform">
                Manage
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h3 class="text-lg font-heading font-semibold text-gray-900">No venues yet</h3>
          <p class="text-gray-500 mt-2 text-sm">Create your first venue to start managing courts and bookings.</p>
          <button
            (click)="createVenue()"
            class="mt-4 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors text-sm"
          >
            Create Your First Venue
          </button>
        </div>
      }
    </div>
  `,
})
export class VenueListComponent implements OnInit {
  venues = signal<Venue[]>([]);
  loading = signal(true);

  constructor(
    private venueService: VenueService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.venueService.getMyVenues().subscribe({
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

  createVenue(): void {
    this.router.navigate(['/court/venues/new']);
  }

  manageVenue(id: string): void {
    this.router.navigate(['/court/venues', id]);
  }
}

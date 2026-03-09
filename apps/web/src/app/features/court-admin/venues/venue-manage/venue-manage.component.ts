import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VenueService, Venue, Court, Booking } from '../../../../core/services/venue.service';

@Component({
  selector: 'app-venue-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <!-- Loading -->
    @if (loading()) {
      <div class="space-y-6 animate-pulse">
        <div class="h-8 bg-gray-200 rounded w-1/3"></div>
        <div class="bg-white rounded-2xl h-48"></div>
        <div class="bg-white rounded-2xl h-64"></div>
      </div>
    }

    @if (!loading() && venue()) {
      <div class="space-y-6">
        <!-- Back -->
        <button (click)="goBack()" class="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Back to venues
        </button>

        <!-- Venue Header -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-start justify-between">
            <div>
              <h1 class="text-2xl font-heading font-bold text-gray-900">{{ venue()!.name }}</h1>
              <p class="text-sm text-gray-500 mt-1">{{ venue()!.address }}, {{ venue()!.city }}, {{ venue()!.state }}</p>
            </div>
            <button
              (click)="editVenue()"
              class="px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Edit Venue
            </button>
          </div>
        </div>

        <!-- Courts Section -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-heading font-semibold text-gray-900">
              Courts
              <span class="text-sm font-normal text-gray-500 ml-1">({{ venue()!.courts?.length || 0 }})</span>
            </h2>
            <button
              (click)="showCourtForm.set(true); editingCourt.set(null); resetCourtForm()"
              class="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              Add Court
            </button>
          </div>

          <!-- Court Form -->
          @if (showCourtForm()) {
            <div class="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-200">
              <h3 class="font-medium text-gray-900 mb-3">{{ editingCourt() ? 'Edit Court' : 'Add New Court' }}</h3>
              <form [formGroup]="courtForm" (ngSubmit)="saveCourt()" class="space-y-3">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Court Name *</label>
                    <input formControlName="name" type="text" placeholder="Court 1"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Price/Hour *</label>
                    <input formControlName="pricePerHour" type="number" step="0.01" placeholder="25.00"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Surface</label>
                    <select formControlName="surface"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
                      <option value="">Select surface</option>
                      <option value="Concrete">Concrete</option>
                      <option value="Asphalt">Asphalt</option>
                      <option value="Sport Court">Sport Court</option>
                      <option value="Wood">Wood</option>
                      <option value="Synthetic">Synthetic</option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-xs font-medium text-gray-700 mb-1">Environment</label>
                    <select formControlName="environment"
                      class="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
                      <option value="">Select environment</option>
                      <option value="Indoor">Indoor</option>
                      <option value="Outdoor">Outdoor</option>
                      <option value="Covered">Covered</option>
                    </select>
                  </div>
                </div>
                <div class="flex gap-2 justify-end">
                  <button type="button" (click)="showCourtForm.set(false)"
                    class="px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors">
                    Cancel
                  </button>
                  <button type="submit" [disabled]="courtForm.invalid || savingCourt()"
                    class="px-4 py-2 bg-primary hover:bg-primary-dark disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors">
                    {{ editingCourt() ? 'Update' : 'Add Court' }}
                  </button>
                </div>
              </form>
            </div>
          }

          <!-- Courts List -->
          @if (venue()!.courts?.length) {
            <div class="space-y-3">
              @for (court of venue()!.courts!; track court._id) {
                <div class="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-all">
                  <div class="flex items-center justify-between">
                    <div>
                      <div class="flex items-center gap-2">
                        <h3 class="font-medium text-gray-900">{{ court.name }}</h3>
                        <span
                          class="w-2 h-2 rounded-full"
                          [class.bg-green-400]="court.isActive !== false"
                          [class.bg-gray-300]="court.isActive === false"
                        ></span>
                      </div>
                      <div class="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        @if (court.surface) {
                          <span>{{ court.surface }}</span>
                        }
                        @if (court.environment) {
                          <span>{{ court.environment }}</span>
                        }
                        <span class="text-primary font-medium">\${{ court.pricePerHour }}/hr</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button
                        (click)="startEditCourt(court)"
                        class="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                        title="Edit court"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                        </svg>
                      </button>
                      <button
                        (click)="removeCourt(court)"
                        class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove court"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          } @else {
            @if (!showCourtForm()) {
              <div class="text-center py-8 text-gray-500 text-sm">
                No courts added yet. Click "Add Court" to get started.
              </div>
            }
          }
        </div>

        <!-- Today's Bookings -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Today's Bookings</h2>
          @if (loadingBookings()) {
            <div class="space-y-3">
              @for (i of [1,2,3]; track i) {
                <div class="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
              }
            </div>
          }
          @if (!loadingBookings() && bookings().length > 0) {
            <div class="space-y-3">
              @for (booking of bookings(); track booking._id) {
                <div class="border border-gray-100 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p class="font-medium text-gray-900 text-sm">{{ booking.courtName || 'Court' }}</p>
                    <p class="text-xs text-gray-500 mt-0.5">{{ booking.startTime }} – {{ booking.endTime }}</p>
                  </div>
                  <span
                    class="px-2.5 py-1 text-xs font-medium rounded-full"
                    [class.bg-green-100]="booking.status === 'confirmed'"
                    [class.text-green-700]="booking.status === 'confirmed'"
                    [class.bg-yellow-100]="booking.status === 'pending'"
                    [class.text-yellow-700]="booking.status === 'pending'"
                    [class.bg-gray-100]="!booking.status || (booking.status !== 'confirmed' && booking.status !== 'pending')"
                    [class.text-gray-600]="!booking.status || (booking.status !== 'confirmed' && booking.status !== 'pending')"
                  >
                    {{ (booking.status || 'confirmed') | titlecase }}
                  </span>
                </div>
              }
            </div>
          }
          @if (!loadingBookings() && bookings().length === 0) {
            <div class="text-center py-8">
              <div class="text-3xl mb-2">📅</div>
              <p class="text-gray-500 text-sm">No bookings for today</p>
            </div>
          }
        </div>
      </div>
    }

    <!-- Delete Confirmation -->
    @if (showDeleteDialog()) {
      <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
        <div class="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
          <h3 class="text-lg font-heading font-semibold text-gray-900">Remove Court?</h3>
          <p class="text-gray-500 text-sm mt-2">This will permanently remove this court and all its bookings.</p>
          <div class="flex gap-3 mt-6">
            <button (click)="showDeleteDialog.set(false)"
              class="flex-1 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm">
              Cancel
            </button>
            <button (click)="confirmRemoveCourt()"
              class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors text-sm">
              Remove
            </button>
          </div>
        </div>
      </div>
    }
  `,
})
export class VenueManageComponent implements OnInit {
  venue = signal<Venue | null>(null);
  bookings = signal<Booking[]>([]);
  loading = signal(true);
  loadingBookings = signal(true);
  showCourtForm = signal(false);
  editingCourt = signal<Court | null>(null);
  savingCourt = signal(false);
  showDeleteDialog = signal(false);
  private courtToDelete: Court | null = null;

  courtForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private venueService: VenueService,
  ) {
    this.courtForm = this.fb.group({
      name: ['', Validators.required],
      surface: [''],
      environment: [''],
      pricePerHour: [0, [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadVenue(id);
      this.loadBookings(id);
    }
  }

  resetCourtForm(): void {
    this.courtForm.reset({ name: '', surface: '', environment: '', pricePerHour: 0 });
  }

  startEditCourt(court: Court): void {
    this.editingCourt.set(court);
    this.courtForm.patchValue({
      name: court.name,
      surface: court.surface ?? '',
      environment: court.environment ?? '',
      pricePerHour: court.pricePerHour,
    });
    this.showCourtForm.set(true);
  }

  saveCourt(): void {
    if (this.courtForm.invalid) return;
    this.savingCourt.set(true);
    const venueId = this.venue()?._id;
    if (!venueId) return;

    const data = this.courtForm.value;
    const editing = this.editingCourt();

    const request$ = editing
      ? this.venueService.updateCourt(venueId, editing._id, data)
      : this.venueService.addCourt(venueId, data);

    request$.subscribe({
      next: () => {
        this.savingCourt.set(false);
        this.showCourtForm.set(false);
        this.editingCourt.set(null);
        this.loadVenue(venueId);
      },
      error: () => {
        this.savingCourt.set(false);
      },
    });
  }

  removeCourt(court: Court): void {
    this.courtToDelete = court;
    this.showDeleteDialog.set(true);
  }

  confirmRemoveCourt(): void {
    const venueId = this.venue()?._id;
    if (!venueId || !this.courtToDelete) return;

    this.showDeleteDialog.set(false);
    this.venueService.removeCourt(venueId, this.courtToDelete._id).subscribe({
      next: () => {
        this.loadVenue(venueId);
        this.courtToDelete = null;
      },
      error: () => {
        this.courtToDelete = null;
      },
    });
  }

  editVenue(): void {
    const id = this.venue()?._id;
    if (id) {
      this.router.navigate(['/court/venues', id, 'edit']);
    }
  }

  goBack(): void {
    this.router.navigate(['/court/venues']);
  }

  private loadVenue(id: string): void {
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
  }

  private loadBookings(venueId: string): void {
    this.venueService.getVenueBookings(venueId).subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
        this.loadingBookings.set(false);
      },
      error: () => {
        this.bookings.set([]);
        this.loadingBookings.set(false);
      },
    });
  }
}

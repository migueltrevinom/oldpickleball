import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VenueService } from '../../../../core/services/venue.service';

@Component({
  selector: 'app-venue-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-3xl mx-auto space-y-6">
      <!-- Back -->
      <button (click)="goBack()" class="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
        Back to venues
      </button>

      <!-- Header -->
      <div>
        <h1 class="text-2xl font-heading font-bold text-gray-900">{{ isEdit ? 'Edit Venue' : 'Create Venue' }}</h1>
        <p class="text-gray-500 mt-1">{{ isEdit ? 'Update your venue details' : 'Set up a new pickleball venue' }}</p>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Basic Info -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Basic Information</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Venue Name *</label>
              <input formControlName="name" type="text" placeholder="e.g. Sunset Pickleball Center"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              @if (form.get('name')?.touched && form.get('name')?.hasError('required')) {
                <p class="text-red-500 text-xs mt-1">Venue name is required</p>
              }
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea formControlName="description" rows="3" placeholder="Describe your venue..."
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"></textarea>
            </div>
          </div>
        </div>

        <!-- Address -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Location</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Street Address *</label>
              <input formControlName="address" type="text" placeholder="123 Main Street"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
                <input formControlName="city" type="text" placeholder="City"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">State *</label>
                <input formControlName="state" type="text" placeholder="State"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">ZIP Code *</label>
                <input formControlName="zip" type="text" placeholder="12345"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                <input formControlName="lat" type="number" step="any" placeholder="0.0"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                <input formControlName="lng" type="number" step="any" placeholder="0.0"
                  class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
            </div>
          </div>
        </div>

        <!-- Contact -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Contact</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input formControlName="phone" type="tel" placeholder="(555) 123-4567"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input formControlName="email" type="email" placeholder="contact@venue.com"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
          </div>
        </div>

        <!-- Operating Hours -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Operating Hours</h2>
          <div formArrayName="hours" class="space-y-3">
            @for (day of daysOfWeek; track day; let i = $index) {
              <div [formGroupName]="i" class="flex items-center gap-3">
                <label class="w-24 text-sm font-medium text-gray-700 shrink-0">{{ day }}</label>
                <label class="flex items-center gap-2 shrink-0">
                  <input type="checkbox" formControlName="closed"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                  <span class="text-xs text-gray-500">Closed</span>
                </label>
                <input formControlName="open" type="time"
                  class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  [class.opacity-40]="getHoursGroup(i).get('closed')?.value" />
                <span class="text-gray-400 text-sm">to</span>
                <input formControlName="close" type="time"
                  class="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  [class.opacity-40]="getHoursGroup(i).get('closed')?.value" />
              </div>
            }
          </div>
        </div>

        <!-- Amenities -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Amenities</h2>
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
            @for (amenity of amenityOptions; track amenity) {
              <label
                class="flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all"
                [ngClass]="isAmenitySelected(amenity)
                  ? 'border-primary bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'"
              >
                <input
                  type="checkbox"
                  [checked]="isAmenitySelected(amenity)"
                  (change)="toggleAmenity(amenity)"
                  class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span class="text-sm" [class.text-primary]="isAmenitySelected(amenity)" [class.text-gray-700]="!isAmenitySelected(amenity)">
                  {{ amenity }}
                </span>
              </label>
            }
          </div>
        </div>

        <!-- Access Settings -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Access Settings</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Access Type</label>
              <select formControlName="accessType"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white">
                <option value="public">Public</option>
                <option value="membership">Membership</option>
                <option value="private">Private</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Registration Fee ($)</label>
              <input formControlName="registrationFee" type="number" step="0.01" placeholder="0.00"
                class="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>
          </div>
        </div>

        <!-- Submit -->
        <div class="flex gap-3">
          <button type="button" (click)="goBack()"
            class="flex-1 py-3 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button type="submit" [disabled]="submitting() || form.invalid"
            class="flex-1 py-3 bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
            @if (submitting()) {
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            }
            {{ isEdit ? 'Update Venue' : 'Create Venue' }}
          </button>
        </div>

        @if (errorMessage()) {
          <p class="text-red-500 text-sm text-center">{{ errorMessage() }}</p>
        }
      </form>
    </div>
  `,
})
export class VenueFormComponent implements OnInit {
  isEdit = false;
  private venueId = '';
  submitting = signal(false);
  errorMessage = signal('');
  selectedAmenities = signal<string[]>([]);

  readonly daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  readonly amenityOptions = [
    'Restrooms', 'Parking', 'Lighting', 'Pro Shop', 'Water Fountain',
    'Seating Area', 'Lockers', 'Showers', 'Wi-Fi', 'Snack Bar',
    'Equipment Rental', 'Lessons Available',
  ];

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private venueService: VenueService,
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      lat: [null as number | null],
      lng: [null as number | null],
      phone: [''],
      email: [''],
      accessType: ['public'],
      registrationFee: [0],
      hours: this.fb.array(
        this.daysOfWeek.map(() =>
          this.fb.group({
            open: ['08:00'],
            close: ['21:00'],
            closed: [false],
          })
        )
      ),
    });
  }

  get hoursArray(): FormArray {
    return this.form.get('hours') as FormArray;
  }

  getHoursGroup(index: number): FormGroup {
    return this.hoursArray.at(index) as FormGroup;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isEdit = true;
      this.venueId = id;
      this.venueService.getVenue(id).subscribe({
        next: (venue) => {
          this.form.patchValue({
            name: venue.name,
            description: venue.description ?? '',
            address: venue.address,
            city: venue.city,
            state: venue.state,
            zip: venue.zip,
            lat: venue.coordinates?.lat ?? null,
            lng: venue.coordinates?.lng ?? null,
            phone: venue.phone ?? '',
            email: venue.email ?? '',
            accessType: venue.accessType ?? 'public',
            registrationFee: venue.registrationFee ?? 0,
          });
          if (venue.hours) {
            this.daysOfWeek.forEach((day, i) => {
              const key = day.toLowerCase();
              const dayHours = venue.hours?.[key];
              if (dayHours) {
                this.getHoursGroup(i).patchValue({
                  open: dayHours.open || '08:00',
                  close: dayHours.close || '21:00',
                  closed: dayHours.closed ?? false,
                });
              }
            });
          }
          this.selectedAmenities.set(venue.amenities ?? []);
        },
        error: () => this.errorMessage.set('Failed to load venue'),
      });
    }
  }

  isAmenitySelected(amenity: string): boolean {
    return this.selectedAmenities().includes(amenity);
  }

  toggleAmenity(amenity: string): void {
    this.selectedAmenities.update((current) =>
      current.includes(amenity)
        ? current.filter((a) => a !== amenity)
        : [...current, amenity]
    );
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.submitting.set(true);
    this.errorMessage.set('');

    const formVal = this.form.value;
    const hours: Record<string, { open: string; close: string; closed?: boolean }> = {};
    this.daysOfWeek.forEach((day, i) => {
      const dayHours = formVal.hours[i];
      hours[day.toLowerCase()] = {
        open: dayHours.open,
        close: dayHours.close,
        closed: dayHours.closed,
      };
    });

    const payload = {
      name: formVal.name,
      description: formVal.description,
      address: formVal.address,
      city: formVal.city,
      state: formVal.state,
      zip: formVal.zip,
      coordinates: formVal.lat && formVal.lng ? { lat: formVal.lat, lng: formVal.lng } : undefined,
      phone: formVal.phone,
      email: formVal.email,
      accessType: formVal.accessType,
      registrationFee: formVal.registrationFee,
      hours,
      amenities: this.selectedAmenities(),
    };

    const request$ = this.isEdit
      ? this.venueService.updateVenue(this.venueId, payload)
      : this.venueService.createVenue(payload);

    request$.subscribe({
      next: (venue) => {
        this.submitting.set(false);
        this.router.navigate(['/court/venues', venue._id]);
      },
      error: (err) => {
        this.submitting.set(false);
        this.errorMessage.set(err?.error?.message || 'Failed to save venue. Please try again.');
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/court/venues']);
  }
}

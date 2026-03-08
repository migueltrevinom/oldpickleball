import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-peach flex items-center justify-center p-4">
      <div class="w-full max-w-lg">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-heading font-bold text-gray-900">Complete Your Profile</h1>
          <p class="text-gray-500 mt-1">Tell us a bit about yourself</p>
        </div>

        <!-- Progress Steps -->
        <div class="flex items-center justify-center gap-2 mb-8">
          @for (s of [1, 2, 3]; track s) {
            <div
              class="h-1.5 w-16 rounded-full transition-colors"
              [class.bg-primary]="step() >= s"
              [class.bg-gray-200]="step() < s"
            ></div>
          }
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          @switch (step()) {
            @case (1) {
              <!-- Step 1: Name -->
              <div class="space-y-5">
                <h2 class="text-lg font-semibold text-gray-900">What's your name?</h2>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">First name</label>
                  <input
                    type="text"
                    [(ngModel)]="firstName"
                    placeholder="John"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">Last name</label>
                  <input
                    type="text"
                    [(ngModel)]="lastName"
                    placeholder="Doe"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <button
                  (click)="step.set(2)"
                  [disabled]="!firstName || !lastName"
                  class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            }
            @case (2) {
              <!-- Step 2: Skill Level -->
              <div class="space-y-5">
                <h2 class="text-lg font-semibold text-gray-900">What's your skill level?</h2>
                <div class="grid grid-cols-2 gap-3">
                  @for (level of skillLevels; track level.value) {
                    <button
                      (click)="skillLevel = level.value"
                      class="p-4 rounded-xl border-2 text-left transition-all"
                      [class.border-primary]="skillLevel === level.value"
                      [class.bg-primary-50]="skillLevel === level.value"
                      [class.border-gray-200]="skillLevel !== level.value"
                      [class.hover:border-gray-300]="skillLevel !== level.value"
                    >
                      <span class="text-2xl block mb-1">{{ level.icon }}</span>
                      <span class="font-medium text-gray-900 block">{{ level.label }}</span>
                      <span class="text-xs text-gray-500">{{ level.desc }}</span>
                    </button>
                  }
                </div>
                <div class="flex gap-3">
                  <button
                    (click)="step.set(1)"
                    class="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    (click)="step.set(3)"
                    [disabled]="!skillLevel"
                    class="flex-1 py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            }
            @case (3) {
              <!-- Step 3: Location -->
              <div class="space-y-5">
                <h2 class="text-lg font-semibold text-gray-900">Where are you located?</h2>
                <p class="text-sm text-gray-500">This helps us find courts near you (optional)</p>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1.5">City</label>
                  <input
                    type="text"
                    [(ngModel)]="city"
                    placeholder="San Francisco"
                    class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                @if (error()) {
                  <p class="text-sm text-red-500">{{ error() }}</p>
                }
                <div class="flex gap-3">
                  <button
                    (click)="step.set(2)"
                    class="flex-1 py-3 px-4 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    (click)="onComplete()"
                    [disabled]="loading()"
                    class="flex-1 py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ loading() ? 'Saving...' : 'Get Started' }}
                  </button>
                </div>
              </div>
            }
          }
        </div>
      </div>
    </div>
  `,
})
export class OnboardingComponent {
  step = signal(1);
  loading = signal(false);
  error = signal('');

  firstName = '';
  lastName = '';
  skillLevel = '';
  city = '';

  skillLevels = [
    { value: 'beginner', label: 'Beginner', icon: '🌱', desc: 'Just starting out' },
    { value: 'intermediate', label: 'Intermediate', icon: '🎾', desc: 'Know the basics' },
    { value: 'advanced', label: 'Advanced', icon: '🔥', desc: 'Competitive player' },
    { value: 'pro', label: 'Pro', icon: '🏆', desc: 'Tournament level' },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onComplete(): void {
    this.loading.set(true);
    this.error.set('');

    this.auth.onboard({
      firstName: this.firstName,
      lastName: this.lastName,
      skillLevel: this.skillLevel,
      city: this.city || undefined,
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Something went wrong. Please try again.');
      },
    });
  }
}

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-peach flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <!-- Logo -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-12 h-12 bg-primary rounded-xl mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          <h1 class="text-2xl font-heading font-bold text-gray-900">OldPickleball</h1>
          <p class="text-gray-500 mt-1">Sign in to your account</p>
        </div>

        <!-- Card -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          @if (!otpSent()) {
            <!-- Email Step -->
            <form (ngSubmit)="onRequestOtp()" class="space-y-5">
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
                <input
                  id="email"
                  type="email"
                  [(ngModel)]="email"
                  name="email"
                  placeholder="you&#64;example.com"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900 placeholder:text-gray-400"
                />
              </div>
              @if (error()) {
                <p class="text-sm text-red-500">{{ error() }}</p>
              }
              <button
                type="submit"
                [disabled]="loading()"
                class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading() ? 'Sending...' : 'Continue with Email' }}
              </button>
            </form>
          } @else {
            <!-- OTP Step -->
            <form (ngSubmit)="onVerifyOtp()" class="space-y-5">
              <div class="text-center mb-2">
                <p class="text-sm text-gray-500">We sent a code to</p>
                <p class="font-medium text-gray-900">{{ email }}</p>
              </div>
              <div>
                <label for="otp" class="block text-sm font-medium text-gray-700 mb-1.5">Verification code</label>
                <input
                  id="otp"
                  type="text"
                  [(ngModel)]="otp"
                  name="otp"
                  placeholder="Enter 6-digit code"
                  maxlength="6"
                  required
                  class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900 placeholder:text-gray-400 text-center text-lg tracking-widest"
                />
              </div>
              @if (error()) {
                <p class="text-sm text-red-500">{{ error() }}</p>
              }
              <button
                type="submit"
                [disabled]="loading()"
                class="w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ loading() ? 'Verifying...' : 'Verify Code' }}
              </button>
              <button
                type="button"
                (click)="otpSent.set(false); error.set('')"
                class="w-full py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← Use a different email
              </button>
            </form>
          }
        </div>
      </div>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  otp = '';
  otpSent = signal(false);
  loading = signal(false);
  error = signal('');

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  onRequestOtp(): void {
    if (!this.email) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.requestOtp(this.email).subscribe({
      next: () => {
        this.loading.set(false);
        this.otpSent.set(true);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Failed to send code. Please try again.');
      },
    });
  }

  onVerifyOtp(): void {
    if (!this.otp) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.verifyOtp(this.email, this.otp).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (!res.isOnboarded) {
          this.router.navigate(['/auth/onboarding']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message ?? 'Invalid code. Please try again.');
      },
    });
  }
}

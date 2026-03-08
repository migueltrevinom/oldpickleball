import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6">
      <!-- Search -->
      <div class="flex-1 max-w-md">
        <div class="relative">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          <input
            type="text"
            placeholder="Search..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50 focus:bg-white"
          />
        </div>
      </div>

      <!-- Right Section -->
      <div class="flex items-center gap-4">
        <!-- Notification Bell -->
        <button class="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
          </svg>
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <!-- User Avatar Dropdown -->
        <div class="relative">
          <button
            (click)="menuOpen = !menuOpen"
            class="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span class="text-sm font-medium text-primary">{{ userInitial }}</span>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
            </svg>
          </button>

          @if (menuOpen) {
            <div class="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
              <a href="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</a>
              <a href="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Settings</a>
              <hr class="my-1 border-gray-100" />
              <button
                (click)="onLogout()"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Sign out
              </button>
            </div>
          }
        </div>
      </div>
    </header>
  `,
})
export class HeaderComponent {
  menuOpen = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  get userInitial(): string {
    const user = this.auth.currentUser();
    return user?.email?.charAt(0).toUpperCase() ?? '?';
  }

  onLogout(): void {
    this.auth.logout();
    this.router.navigate(['/auth/login']);
  }
}

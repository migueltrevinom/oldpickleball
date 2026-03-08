import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-court-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-heading font-bold text-gray-900">Court Dashboard</h1>
        <p class="text-gray-500 mt-1">Manage your courts and bookings</p>
      </div>

      <!-- Today's Overview -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        @for (stat of todayStats; track stat.label) {
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-500">{{ stat.label }}</p>
              <span class="text-xl">{{ stat.icon }}</span>
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stat.value }}</p>
            <p class="text-xs text-gray-400 mt-1">{{ stat.sub }}</p>
          </div>
        }
      </div>

      <!-- Calendar Preview & Recent Bookings -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Calendar Placeholder -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Today's Schedule</h2>
          <div class="space-y-3">
            <div class="text-center py-8">
              <div class="text-4xl mb-3">📅</div>
              <p class="text-gray-500">No bookings today</p>
              <p class="text-sm text-gray-400 mt-1">Bookings will appear here</p>
            </div>
          </div>
        </div>

        <!-- Recent Bookings -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Recent Bookings</h2>
          <div class="text-center py-8">
            <div class="text-4xl mb-3">📋</div>
            <p class="text-gray-500">No recent bookings</p>
            <p class="text-sm text-gray-400 mt-1">New bookings will show up here</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class CourtAdminDashboardComponent {
  todayStats = [
    { label: "Today's Bookings", value: '0', icon: '📅', sub: 'No bookings yet' },
    { label: 'Check-ins', value: '0', icon: '✅', sub: 'Awaiting check-ins' },
    { label: 'Revenue', value: '$0', icon: '💰', sub: 'Today' },
    { label: 'Active Courts', value: '0', icon: '🏟️', sub: 'Set up your courts' },
  ];
}

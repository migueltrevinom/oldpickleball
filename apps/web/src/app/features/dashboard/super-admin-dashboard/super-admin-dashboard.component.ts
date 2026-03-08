import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-super-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-heading font-bold text-gray-900">Platform Overview</h1>
        <p class="text-gray-500 mt-1">Monitor and manage the entire platform</p>
      </div>

      <!-- Platform Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        @for (metric of platformMetrics; track metric.label) {
          <div class="bg-white rounded-xl border border-gray-100 p-5">
            <div class="flex items-center justify-between">
              <p class="text-sm text-gray-500">{{ metric.label }}</p>
              <span class="text-xl">{{ metric.icon }}</span>
            </div>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ metric.value }}</p>
            <div class="flex items-center gap-1 mt-1">
              <span class="text-xs font-medium" [class.text-green-500]="metric.positive">{{ metric.change }}</span>
              <span class="text-xs text-gray-400">vs last month</span>
            </div>
          </div>
        }
      </div>

      <!-- Growth & Signups -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Growth Chart Placeholder -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Growth</h2>
          <div class="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
            <div class="text-center">
              <div class="text-4xl mb-2">📈</div>
              <p class="text-sm text-gray-500">Analytics chart coming soon</p>
            </div>
          </div>
        </div>

        <!-- Recent Signups -->
        <div class="bg-white rounded-xl border border-gray-100 p-6">
          <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Recent Signups</h2>
          <div class="text-center py-8">
            <div class="text-4xl mb-3">👥</div>
            <p class="text-gray-500">No recent signups</p>
            <p class="text-sm text-gray-400 mt-1">New users will appear here</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class SuperAdminDashboardComponent {
  platformMetrics = [
    { label: 'Total Users', value: '0', icon: '👥', change: '—', positive: true },
    { label: 'Total Courts', value: '0', icon: '🏟️', change: '—', positive: true },
    { label: 'Total Sessions', value: '0', icon: '🎾', change: '—', positive: true },
    { label: 'Revenue', value: '$0', icon: '💰', change: '—', positive: true },
  ];
}

import { Component, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/auth/auth.service';

@Component({
  selector: 'app-player-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="space-y-6">
      <!-- Welcome Card -->
      <div class="bg-gradient-to-r from-primary to-primary-dark rounded-2xl p-6 text-white">
        <h1 class="text-2xl font-heading font-bold">Welcome back{{ userName() ? ', ' + userName() : '' }}!</h1>
        <p class="mt-1 text-white/80">Ready for your next game?</p>
        <div class="mt-4 flex items-center gap-3 text-sm">
          <div class="bg-white/20 rounded-lg px-3 py-1.5">
            <span class="text-white/70">Next session:</span>
            <span class="ml-1 font-medium">No upcoming sessions</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div>
        <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          @for (action of quickActions; track action.title) {
            <button class="bg-white rounded-xl border border-gray-100 p-5 text-left hover:shadow-md hover:border-primary/20 transition-all group">
              <span class="text-3xl block mb-3">{{ action.icon }}</span>
              <h3 class="font-medium text-gray-900 group-hover:text-primary transition-colors">{{ action.title }}</h3>
              <p class="text-sm text-gray-500 mt-1">{{ action.desc }}</p>
            </button>
          }
        </div>
      </div>

      <!-- Stats Cards -->
      <div>
        <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Your Stats</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          @for (stat of stats; track stat.label) {
            <div class="bg-white rounded-xl border border-gray-100 p-5">
              <p class="text-sm text-gray-500">{{ stat.label }}</p>
              <p class="text-2xl font-bold text-gray-900 mt-1">{{ stat.value }}</p>
              <p class="text-xs mt-1" [class.text-green-500]="stat.trend === 'up'" [class.text-gray-400]="stat.trend === 'neutral'">
                {{ stat.change }}
              </p>
            </div>
          }
        </div>
      </div>

      <!-- Upcoming Sessions -->
      <div>
        <h2 class="text-lg font-heading font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
        <div class="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <div class="text-4xl mb-3">🎾</div>
          <h3 class="font-medium text-gray-900">No upcoming sessions</h3>
          <p class="text-sm text-gray-500 mt-1">Find a court and book your first session!</p>
          <button class="mt-4 px-6 py-2.5 bg-primary hover:bg-primary-dark text-white font-medium rounded-xl transition-colors text-sm">
            Find a Court
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PlayerDashboardComponent {
  constructor(private auth: AuthService) {}

  userName = computed(() => {
    const user = this.auth.currentUser();
    return user?.email?.split('@')[0] ?? '';
  });

  quickActions = [
    { title: 'Find Court', icon: '🏟️', desc: 'Browse available courts near you' },
    { title: 'Create Session', icon: '📅', desc: 'Set up a new game session' },
    { title: 'Browse Games', icon: '🎯', desc: 'Join open pickup games' },
  ];

  stats = [
    { label: 'Games Played', value: '0', change: 'Get started!', trend: 'neutral' as 'up' | 'neutral' },
    { label: 'Reliability Score', value: '—', change: 'No data yet', trend: 'neutral' as 'up' | 'neutral' },
    { label: 'Skill Level', value: '—', change: 'Set in profile', trend: 'neutral' as 'up' | 'neutral' },
    { label: 'Win Rate', value: '—', change: 'Play games!', trend: 'neutral' as 'up' | 'neutral' },
  ];
}

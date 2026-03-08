import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/auth/auth.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <aside
      class="h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300"
      [class.w-64]="!collapsed()"
      [class.w-16]="collapsed()"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-4 border-b border-sidebar-border">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
            </svg>
          </div>
          @if (!collapsed()) {
            <span class="font-heading font-bold text-gray-900 whitespace-nowrap">OldPickleball</span>
          }
        </div>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        @for (item of navItems(); track item.path) {
          <a
            [routerLink]="item.path"
            routerLinkActive="bg-primary-light text-primary-dark border-l-2 border-primary"
            [routerLinkActiveOptions]="{ exact: item.path === '/dashboard' }"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors group"
            [class.justify-center]="collapsed()"
          >
            <span class="text-lg flex-shrink-0" [innerHTML]="item.icon"></span>
            @if (!collapsed()) {
              <span class="text-sm font-medium">{{ item.label }}</span>
            }
          </a>
        }
      </nav>

      <!-- User Section -->
      <div class="border-t border-sidebar-border p-3">
        <div class="flex items-center gap-3" [class.justify-center]="collapsed()">
          <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
            <span class="text-sm font-medium text-primary">{{ userInitials() }}</span>
          </div>
          @if (!collapsed()) {
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ userName() }}</p>
              <p class="text-xs text-gray-500 truncate">{{ userRole() }}</p>
            </div>
          }
        </div>
      </div>

      <!-- Collapse Toggle -->
      <button
        (click)="collapsed.set(!collapsed())"
        class="h-10 border-t border-sidebar-border flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg class="w-4 h-4 transition-transform" [class.rotate-180]="collapsed()" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"/>
        </svg>
      </button>
    </aside>
  `,
})
export class SidebarComponent {
  collapsed = signal(false);

  private playerNav: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Courts', path: '/courts', icon: '🏟️' },
    { label: 'Sessions', path: '/sessions', icon: '📅' },
    { label: 'Profile', path: '/profile', icon: '👤' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  private courtAdminNav: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Calendar', path: '/court/calendar', icon: '📅' },
    { label: 'My Courts', path: '/court/courts', icon: '🏟️' },
    { label: 'Sessions', path: '/court/sessions', icon: '🎾' },
    { label: 'Staff', path: '/court/staff', icon: '👥' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  private superAdminNav: NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: '📊' },
    { label: 'Users', path: '/admin/users', icon: '👥' },
    { label: 'Courts', path: '/admin/courts', icon: '🏟️' },
    { label: 'Analytics', path: '/admin/analytics', icon: '📈' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  constructor(private auth: AuthService) {}

  navItems = computed(() => {
    const role = this.auth.role();
    switch (role) {
      case 'super_admin': return this.superAdminNav;
      case 'court_admin': return this.courtAdminNav;
      default: return this.playerNav;
    }
  });

  userInitials = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return '?';
    return user.email.charAt(0).toUpperCase();
  });

  userName = computed(() => {
    const user = this.auth.currentUser();
    return user?.email ?? 'User';
  });

  userRole = computed(() => {
    const role = this.auth.role();
    if (!role) return '';
    return role.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  });
}

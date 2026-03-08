import { Routes } from '@angular/router';
import { ShellComponent } from './shared/layout/shell/shell.component';
import { authGuard, roleGuard, onboardedGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./features/auth/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: 'onboarding',
        loadComponent: () =>
          import('./features/auth/onboarding/onboarding.component').then((m) => m.OnboardingComponent),
        canActivate: [authGuard],
      },
    ],
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard, onboardedGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/player-dashboard/player-dashboard.component').then(
            (m) => m.PlayerDashboardComponent,
          ),
      },
      {
        path: 'courts',
        loadComponent: () =>
          import('./features/dashboard/player-dashboard/player-dashboard.component').then(
            (m) => m.PlayerDashboardComponent,
          ),
      },
      {
        path: 'sessions',
        loadComponent: () =>
          import('./features/dashboard/player-dashboard/player-dashboard.component').then(
            (m) => m.PlayerDashboardComponent,
          ),
      },
      {
        path: 'profile',
        loadComponent: () =>
          import('./features/dashboard/player-dashboard/player-dashboard.component').then(
            (m) => m.PlayerDashboardComponent,
          ),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('./features/dashboard/player-dashboard/player-dashboard.component').then(
            (m) => m.PlayerDashboardComponent,
          ),
      },
      {
        path: 'court',
        canActivate: [roleGuard(['court_admin', 'super_admin'])],
        children: [
          {
            path: 'calendar',
            loadComponent: () =>
              import('./features/dashboard/court-admin-dashboard/court-admin-dashboard.component').then(
                (m) => m.CourtAdminDashboardComponent,
              ),
          },
          {
            path: 'courts',
            loadComponent: () =>
              import('./features/dashboard/court-admin-dashboard/court-admin-dashboard.component').then(
                (m) => m.CourtAdminDashboardComponent,
              ),
          },
          {
            path: 'sessions',
            loadComponent: () =>
              import('./features/dashboard/court-admin-dashboard/court-admin-dashboard.component').then(
                (m) => m.CourtAdminDashboardComponent,
              ),
          },
          {
            path: 'staff',
            loadComponent: () =>
              import('./features/dashboard/court-admin-dashboard/court-admin-dashboard.component').then(
                (m) => m.CourtAdminDashboardComponent,
              ),
          },
        ],
      },
      {
        path: 'admin',
        canActivate: [roleGuard(['super_admin'])],
        children: [
          {
            path: 'users',
            loadComponent: () =>
              import('./features/dashboard/super-admin-dashboard/super-admin-dashboard.component').then(
                (m) => m.SuperAdminDashboardComponent,
              ),
          },
          {
            path: 'courts',
            loadComponent: () =>
              import('./features/dashboard/super-admin-dashboard/super-admin-dashboard.component').then(
                (m) => m.SuperAdminDashboardComponent,
              ),
          },
          {
            path: 'analytics',
            loadComponent: () =>
              import('./features/dashboard/super-admin-dashboard/super-admin-dashboard.component').then(
                (m) => m.SuperAdminDashboardComponent,
              ),
          },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '/auth/login' },
];

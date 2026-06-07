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
          import('./features/courts/court-finder/court-finder.component').then(
            (m) => m.CourtFinderComponent,
          ),
      },
      {
        path: 'courts/:id',
        loadComponent: () =>
          import('./features/courts/venue-detail/venue-detail.component').then(
            (m) => m.VenueDetailComponent,
          ),
      },
      {
        path: 'courts/:venueId/book/:courtId',
        loadComponent: () =>
          import('./features/courts/booking-calendar/booking-calendar.component').then(
            (m) => m.BookingCalendarComponent,
          ),
      },
      {
        path: 'bookings',
        loadComponent: () =>
          import('./features/bookings/my-bookings/my-bookings.component').then(
            (m) => m.MyBookingsComponent,
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
            path: 'venues',
            loadComponent: () =>
              import('./features/court-admin/venues/venue-list/venue-list.component').then(
                (m) => m.VenueListComponent,
              ),
          },
          {
            path: 'venues/new',
            loadComponent: () =>
              import('./features/court-admin/venues/venue-form/venue-form.component').then(
                (m) => m.VenueFormComponent,
              ),
          },
          {
            path: 'venues/:id/edit',
            loadComponent: () =>
              import('./features/court-admin/venues/venue-form/venue-form.component').then(
                (m) => m.VenueFormComponent,
              ),
          },
          {
            path: 'venues/:id',
            loadComponent: () =>
              import('./features/court-admin/venues/venue-manage/venue-manage.component').then(
                (m) => m.VenueManageComponent,
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

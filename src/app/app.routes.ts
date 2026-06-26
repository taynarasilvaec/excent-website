import { Routes } from '@angular/router'
import { languageGuard } from './shared/guards/language.guard'

// 404 for any route that isn't a built page yet.
const notFound = {
  loadComponent: () =>
    import('./features/not-found/not-found').then(m => m.NotFound),
  data: { title: 'browser-title.not-found' },
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/en',
    pathMatch: 'full',
  },
  {
    path: 'designsystem',
    loadComponent: () =>
      import('./features/design-system/design-system').then(m => m.DesignSystem),
    data: { title: 'browser-title.design-system' },
  },
  {
    path: ':lang',
    canMatch: [languageGuard],
    loadComponent: () => import('./features/features').then(m => m.Features),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/trading/home/home').then(m => m.Home),
        data: { title: 'browser-title.home' },
      },
      // Built pages — flat URLs (no trading/accounts · trading/execution prefix).
      {
        path: 'live-account',
        loadComponent: () =>
          import('./features/trading/accounts/live-accounts/live-accounts').then(
            m => m.LiveAccounts,
          ),
      },
      {
        path: 'mam-ecosystem',
        loadComponent: () =>
          import('./features/trading/accounts/mam-ecosystem/mam-ecosystem').then(
            m => m.MamEcosystem,
          ),
      },
      {
        path: 'deposits-and-withdrawals',
        loadComponent: () =>
          import(
            './features/trading/execution/deposits-and-withdrawals/deposits-and-withdrawals'
          ).then(m => m.DepositsAndWithdrawals),
      },
      // Everything else isn't built yet → 404
      { path: '**', ...notFound },
    ],
  },
  {
    path: '**',
    redirectTo: '/en',
  },
]

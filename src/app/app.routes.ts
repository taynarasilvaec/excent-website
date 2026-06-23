import { Routes } from '@angular/router'
import { languageGuard } from './shared/guards/language.guard'

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
      {
        path: 'trading',
        loadComponent: () =>
          import('./features/trading/trading').then(m => m.Trading),
        children: [
          {
            path: 'accounts',
            children: [
              {
                path: 'live-account',
                loadComponent: () =>
                  import(
                    './features/trading/accounts/live-accounts/live-accounts'
                  ).then(m => m.LiveAccounts),
              },
              {
                path: 'mam-ecosystem',
                loadComponent: () =>
                  import(
                    './features/trading/accounts/mam-ecosystem/mam-ecosystem'
                  ).then(m => m.MamEcosystem),
              },
              // NO listada por marketing en SEO — mantener
              {
                path: 'trading-strategies',
                loadComponent: () =>
                  import(
                    './features/trading/accounts/trading-strategies/trading-strategies'
                  ).then(m => m.TradingStrategies),
              },
            ],
          },
          {
            path: 'execution',
            children: [
              {
                path: 'platform',
                loadComponent: () =>
                  import(
                    './features/trading/execution/platform/platform'
                  ).then(m => m.Platform),
              },
              {
                path: 'deposits-and-withdrawals',
                loadComponent: () =>
                  import(
                    './features/trading/execution/deposits-and-withdrawals/deposits-and-withdrawals'
                  ).then(m => m.DepositsAndWithdrawals),
              },
              {
                path: 'instant-execution',
                loadComponent: () =>
                  import(
                    './features/trading/execution/instant-execution/instant-execution'
                  ).then(m => m.InstantExecution),
              },
              // NO listadas por marketing en SEO — mantener
              {
                path: 'types-execution',
                loadComponent: () =>
                  import(
                    './features/trading/execution/types-execution/types-execution'
                  ).then(m => m.TypesExecution),
              },
              {
                path: 'finance',
                loadComponent: () =>
                  import(
                    './features/trading/execution/finance/finance'
                  ).then(m => m.Finance),
              },
            ],
          },
        ],
      },
      {
        path: 'markets',
        loadComponent: () =>
          import('./features/markets/markets').then(m => m.Markets),
      },
      {
        path: 'markets/asset-groups',
        loadComponent: () =>
          import('./features/markets/asset-groups/asset-groups').then(
            m => m.AssetGroups
          ),
      },
      {
        path: 'markets/asset-classes',
        loadComponent: () =>
          import('./features/markets/asset-classes/asset-classes').then(
            m => m.AssetClasses
          ),
      },
      {
        path: 'markets/conditions/spread',
        loadComponent: () =>
          import('./features/markets/conditions/spread/spread').then(
            m => m.Spread
          ),
      },
      {
        path: 'markets/conditions/leverage-and-margin',
        loadComponent: () =>
          import(
            './features/markets/conditions/leverage-and-margin/leverage-and-margin'
          ).then(m => m.LeverageAndMargin),
      },
      {
        path: 'markets/conditions/swap',
        loadComponent: () =>
          import('./features/markets/conditions/swap/swap').then(m => m.Swap),
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./features/resources/resources').then(m => m.Resources),
        children: [
          {
            path: 'tools',
            loadComponent: () =>
              import('./features/resources/tools/tools').then(m => m.Tools),
            children: [
              {
                path: 'corporate-calendar',
                loadComponent: () =>
                  import(
                    './features/resources/tools/corporate-calendar/corporate-calendar'
                  ).then(m => m.CorporateCalendar),
              },
              {
                path: 'economic-calendar',
                loadComponent: () =>
                  import(
                    './features/resources/tools/economic-calendar/economic-calendar'
                  ).then(m => m.EconomicCalendar),
              },
              {
                path: 'analysis-iq',
                loadComponent: () =>
                  import(
                    './features/resources/tools/analysis-iq/analysis-iq'
                  ).then(m => m.AnalysisIq),
              },
              {
                path: 'news-iq',
                loadComponent: () =>
                  import('./features/resources/tools/news-iq/news-iq').then(
                    m => m.NewsIq
                  ),
              },
              {
                path: 'calculators',
                loadComponent: () =>
                  import(
                    './features/resources/tools/calculators/calculators'
                  ).then(m => m.Calculators),
              },
            ],
          },
          {
            path: 'excent-academy',
            loadComponent: () =>
              import(
                './features/resources/excent-academy/excent-academy'
              ).then(m => m.ExcentAcademy),
            children: [
              {
                path: 'market-blog',
                loadComponent: () =>
                  import(
                    './features/resources/excent-academy/market-blog/market-blog'
                  ).then(m => m.MarketBlog),
              },
              {
                path: 'webinars',
                loadComponent: () =>
                  import(
                    './features/resources/excent-academy/webinars/webinars'
                  ).then(m => m.Webinars),
              },
              {
                path: 'glossary',
                loadComponent: () =>
                  import(
                    './features/resources/excent-academy/glossary/glossary'
                  ).then(m => m.Glossary),
              },
              // NO listada por marketing en SEO — mantener
              {
                path: 'knowledge',
                loadComponent: () =>
                  import(
                    './features/resources/excent-academy/knowledge/knowledge'
                  ).then(m => m.Knowledge),
              },
            ],
          },
          {
            path: 'knowledge-base',
            loadComponent: () =>
              import(
                './features/resources/knowledge-base/knowledge-base'
              ).then(m => m.KnowledgeBase),
          },
        ],
      },
      {
        path: 'company',
        loadComponent: () =>
          import('./features/company/company').then(m => m.Company),
        children: [
          {
            path: 'about-us',
            loadComponent: () =>
              import('./features/company/about-us/about-us').then(
                m => m.AboutUs
              ),
            children: [
              {
                path: 'regulations',
                loadComponent: () =>
                  import(
                    './features/company/about-us/regulations/regulations'
                  ).then(m => m.Regulations),
              },
              {
                path: 'legal-area',
                loadComponent: () =>
                  import(
                    './features/company/about-us/legal-area/legal-area'
                  ).then(m => m.LegalArea),
              },
              // NO listada por marketing en SEO — mantener
              {
                path: 'excent-capital',
                loadComponent: () =>
                  import(
                    './features/company/about-us/excent-capital/excent-capital'
                  ).then(m => m.ExcentCapital),
              },
            ],
          },
          {
            path: 'help',
            loadComponent: () =>
              import('./features/company/help/help').then(m => m.Help),
            children: [
              {
                path: 'support',
                loadComponent: () =>
                  import('./features/company/help/support/support').then(
                    m => m.Support
                  ),
              },
              {
                path: 'faq',
                loadComponent: () =>
                  import('./features/company/help/faq/faq').then(m => m.Faq),
              },
            ],
          },
          {
            path: 'help-center',
            loadComponent: () =>
              import(
                './features/company/help/help-center/help-center'
              ).then(m => m.HelpCenter),
          },
        ],
      },
      {
        path: 'partners',
        loadComponent: () =>
          import('./features/partners/partners').then(m => m.Partners),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/en',
  },
]

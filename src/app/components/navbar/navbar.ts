import { CommonModule } from '@angular/common'
import { Component, ElementRef, HostListener, computed, inject, input, output, signal } from '@angular/core'
import { toSignal } from '@angular/core/rxjs-interop'
import { NavigationEnd, Router, RouterLink } from '@angular/router'
import { TranslateModule } from '@ngx-translate/core'
import { filter, map, startWith } from 'rxjs'
import { SlideEffect } from '../slide-effect/slide-effect'
import {
  NavbarIcons,
  NavbarLogo,
  NavbarLogoPosition,
  NavItem,
} from './navbar.types'

const DEFAULT_ICONS: Required<NavbarIcons> = {
  menu: '/assets/icons/desktop-menu.svg',
  menuMobile: '/assets/icons/mobile-menu.svg',
  close: '/assets/icons/close.svg',
  search: '/assets/icons/search.svg',
  externalArrow: '/assets/icons/arrow-right-up.svg',
  arrowLeft: '/assets/icons/arrow-left.svg',
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, SlideEffect, TranslateModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly elementRef = inject(ElementRef<HTMLElement>)
  private readonly router = inject(Router)

  public items = input<NavItem[]>([])
  public logo = input<NavbarLogo | null>(null)
  public logoPosition = input<NavbarLogoPosition>('center')
  public searchable = input<boolean>(true)
  public expandable = input<boolean>(true)
  public icons = input<NavbarIcons>({})
  public readonly search = output<string>()
  public readonly openStateChange = output<boolean>()
  public readonly isOpen = signal(false)
  public readonly activeItem = signal<NavItem | null>(null)
  public readonly searchValue = signal('')
  protected readonly logoFailed = signal(false)
  protected readonly activeMega = computed(() => this.activeItem()?.mega ?? null)
  protected readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects),
      startWith(this.router.url),
    ),
    { initialValue: this.router.url },
  )
  protected readonly currentLang = computed<string>(() => {
    const url = this.currentUrl()
    const match = url.match(/^\/([a-z]{2,3})(\/|$|\?)/i)
    return match?.[1] ?? 'en'
  })
  protected readonly resolvedIcons = computed<Required<NavbarIcons>>(() => ({
    ...DEFAULT_ICONS,
    ...this.icons(),
  }))

  protected resolveLink(link: string | undefined): string {
    if (!link) return `/${this.currentLang()}`
    if (link.startsWith('http')) return link
    return `/${this.currentLang()}/${link}`
  }

  protected isItemCurrent(item: NavItem): boolean {
    const url = this.currentUrl()
    if (item.link && !item.external && this.matchesRoute(url, item.link)) return true
    if (item.mega) {
      return item.mega.sections.some(section =>
        section.items.some(sub => !sub.external && this.matchesRoute(url, sub.link)),
      )
    }
    return false
  }

  private matchesRoute(url: string, link: string): boolean {
    const lang = this.currentLang()
    const fullLink = link ? `/${lang}/${link}` : `/${lang}`
    if (!link) return url === `/${lang}` || url === `/${lang}/`
    return url === fullLink || url.startsWith(`${fullLink}/`)
  }

  protected onItemClick(item: NavItem): void {
    if (item.mega) {
      this.activeItem.set(this.activeItem() === item ? null : item)
      return
    }
    this.closeMenu()
  }
  protected onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value
    this.searchValue.set(value)
    this.search.emit(value)
  }
  protected onLogoError(): void {
    this.logoFailed.set(true)
  }

  public closeDrill(): void {
    this.activeItem.set(null)
  }

  public toggleOpen(): void {
    if (!this.expandable()) return
    const next = !this.isOpen()
    this.isOpen.set(next)
    if (next) {
      // Open with a mega already expanded: the current route's mega if any,
      // otherwise the first item that has a mega (Trading).
      const current = this.items().find(i => !!i.mega && this.isItemCurrent(i))
      const firstMega = this.items().find(i => !!i.mega)
      this.activeItem.set(current ?? firstMega ?? null)
    } else {
      this.activeItem.set(null)
    }
    this.openStateChange.emit(next)
  }

  public closeMenu(): void {
    if (!this.isOpen()) return
    this.isOpen.set(false)
    this.activeItem.set(null)
    this.openStateChange.emit(false)
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.isOpen()) return
    const host = this.elementRef.nativeElement as HTMLElement
    if (!host.contains(event.target as Node)) {
      this.closeMenu()
    }
  }
}

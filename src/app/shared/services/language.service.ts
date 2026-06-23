import { Injectable, inject } from '@angular/core'
import { ExcentServCatalogsService } from '../../../excent-shims/excent-serv-catalogs/index'
import { BehaviorSubject } from 'rxjs'
import { LanguageItem } from '../constants'
import { StoreService } from './store.service'

@Injectable({ providedIn: 'root' })
export class LanguageService {
  private readonly _store = inject(StoreService)
  private readonly _catalogs = inject(ExcentServCatalogsService)

  public readonly language$ = new BehaviorSubject<string>('en')

  constructor() {
    this.updateFromStore()
  }

  public updateFromStore(): void {
    const login = this._store.login()
    const languageId = login?.config?.language

    if (login && languageId !== undefined) {
      this._catalogs
        .getLanguages<Array<LanguageItem>>()
        .subscribe((response) => {
          const lang = response.find((res) => res.id === languageId)
          if (lang) this.language$.next(lang.shortName)
        })
    } else {
      this.language$.next('en')
    }
  }

  public setLanguage(l: string): void {
    if (this.language$.value !== l) this.language$.next(l)
  }
}

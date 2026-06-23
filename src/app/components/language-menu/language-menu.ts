import { Component, input, output } from '@angular/core'
import { LanguageOption, SupportedLanguage } from '../../shared/constants'

@Component({
  selector: 'language-menu',
  standalone: true,
  templateUrl: './language-menu.html',
  styleUrl: './language-menu.scss',
})
export class LanguageMenu {
  public readonly options = input.required<LanguageOption[]>()
  public readonly currentLang = input<string | null>(null)

  public readonly select = output<SupportedLanguage>()

  protected isSelected(code: SupportedLanguage): boolean {
    return this.currentLang() === code
  }

  protected onSelect(code: SupportedLanguage): void {
    this.select.emit(code)
  }
}

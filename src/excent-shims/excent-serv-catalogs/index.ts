import { Injectable } from '@angular/core'
import { Observable, of } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class ExcentServCatalogsService {
  init(): void {}
  getLanguages<T>(): Observable<T> { return of([] as unknown as T) }
}

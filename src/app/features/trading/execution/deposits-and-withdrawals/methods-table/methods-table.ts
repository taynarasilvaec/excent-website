import { Component, input } from '@angular/core'

export interface MethodRow {
  method: string
  time: string
}

/** Blue "Method / Processing Time" table card — shared by Deposits & Withdrawals. */
@Component({
  selector: 'app-methods-table',
  standalone: true,
  templateUrl: './methods-table.html',
  styleUrl: './methods-table.scss',
})
export class MethodsTable {
  readonly rows = input.required<MethodRow[]>()
}

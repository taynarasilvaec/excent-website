import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-trading',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './trading.html',
  styleUrl: './trading.scss',
})
export class Trading {}

import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './tools.html',
  styleUrl: './tools.scss',
})
export class Tools {}

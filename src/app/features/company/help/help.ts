import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './help.html',
  styleUrl: './help.scss',
})
export class Help {}

import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './resources.html',
  styleUrl: './resources.scss',
})
export class Resources {}

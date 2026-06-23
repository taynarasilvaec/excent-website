import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './about-us.html',
  styleUrl: './about-us.scss',
})
export class AboutUs {}

import { Component } from '@angular/core'
import { RevealDirective } from '../../../shared/directives/reveal.directive'
import { HomeBlogPosts } from './blog-posts/blog-posts'
import { HomeCredibility } from './credibility/credibility'
import { HomeDevices } from './devices/devices'
import { HomeGraphic } from './graphic/graphic'
import { HomeHero } from './hero/hero'
import { HomeOffices } from './offices/offices'
import { HomeReviews } from './reviews/reviews'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HomeHero,
    HomeGraphic,
    HomeDevices,
    HomeOffices,
    HomeReviews,
    HomeBlogPosts,
    HomeCredibility,
    RevealDirective,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}

export interface NavbarLogo {
  src: string
  alt?: string
  class?: string
}

export type NavbarLogoPosition = 'left' | 'center'

export interface NavMegaItem {
  label: string
  link: string
  external?: boolean
}

export interface NavMegaSection {
  title: string
  items: NavMegaItem[]
}

export interface NavMegaPromo {
  kicker?: string
  title: string
  image: string
  link: string
  cta?: string
}

export interface NavItem {
  label: string
  link?: string
  external?: boolean
  mega?: {
    sections: NavMegaSection[]
    promo?: NavMegaPromo
  }
}

export interface NavbarIcons {
  menu?: string
  menuMobile?: string
  close?: string
  search?: string
  externalArrow?: string
  arrowLeft?: string
}

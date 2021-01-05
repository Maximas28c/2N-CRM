import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MaterialService } from '../../classes/material.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-site-layouts',
  templateUrl: './site-layouts.component.html',
  styleUrls: ['./site-layouts.component.scss']
})
export class SiteLayoutsComponent implements AfterViewInit {

  @ViewChild('floating')
  floatingRef!: ElementRef

  links = [
    {url: 'overview', name: 'Overview'},
    {url: 'analytics', name: 'Analytics'},
    {url: 'history', name: 'History'},
    {url: 'order', name: 'Order'},
    {url: 'categories', name: 'Goods selection'}
  ]

  constructor(private auth: AuthService,
              private router: Router) { }

  ngAfterViewInit(): void {
    MaterialService.initializeFloatingButton(this.floatingRef)
  }

  logOut(event: Event){
    event.preventDefault()
    this.auth.logout()
    this.router.navigate(['/login'])
  }

}

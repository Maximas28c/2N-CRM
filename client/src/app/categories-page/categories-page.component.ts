import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core'
import {CategoriesService} from '../shared/services/categories.service'
import {Category} from '../shared/interfaces'
import { Observable } from 'rxjs/index'
import { MaterialInstance, MaterialService } from '../shared/classes/material.service'

@Component({
  selector: 'app-categories-page',
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPageComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('tapTarget') tapTargetRef: ElementRef
  tapTarget: MaterialInstance
  categories$!: Observable<Category[]>

  constructor(private categoriesService: CategoriesService) {
  }

  ngOnInit() {
    this.categories$ = this.categoriesService.fetch()
  }

  ngAfterViewInit(): void {
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }

  ngOnDestroy(): void {
    this.tapTarget.destroy() 
  }

  openInfo(){
    this.tapTarget.open()
  }
}

import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { Filter, Order } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';

const STEP = 3

@Component({
  selector: 'app-history-page',
  templateUrl: './history-page.component.html',
  styleUrls: ['./history-page.component.scss']
})
export class HistoryPageComponent implements OnInit, OnDestroy, AfterViewInit {

  oSub: Subscription
  filter: Filter = {}

  filterIsVisible = false
  loading = false
  reloading = false
  endOfOrdersList = false

  offset: number = 0
  limit: number = STEP

  orders: Order[] = []

  @ViewChild('tooltip') tooltipRef: ElementRef
  tooltip: MaterialInstance
  @ViewChild('tapTarget') tapTargetRef: ElementRef
  tapTarget: MaterialInstance
  constructor(private ordersService: OrdersService) { }




  ngOnInit(): void {
    this.reloading = true
    this.fetch()
  }

  private fetch(){
    const params  = Object.assign({}, this.filter, {
      offset: this.offset,
      limit: this.limit
    })

    this.oSub = this.ordersService.fetch(params).subscribe(orders =>{
      this.orders = this.orders.concat(orders)
      this.endOfOrdersList = orders.length < STEP
      this.loading = false
      this.reloading = false
    })
  }
  
  isFiltered(): boolean {
    return Object.keys(this.filter).length !== 0
  }

  loadMore(){
    this.offset += STEP
    this.loading = true
    this.fetch()
  }

  applyFilter(filter: Filter){
    this.orders = []
    this.offset = 0
    this.filter = filter
    this.reloading = true
    this.fetch()
  }

  ngAfterViewInit(): void {
    this.tooltip = MaterialService.initToolTip(this.tooltipRef)
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }

  ngOnDestroy(): void {
    this.tooltip.destroy()
    this.tapTarget.destroy()
    this.oSub.unsubscribe()
  }

  openInfo(){
    this.tapTarget.open()
  }
  
}

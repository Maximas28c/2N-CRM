import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';
import { Order, OrderPosition } from '../shared/interfaces';
import { OrdersService } from '../shared/services/orders.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-page',
  templateUrl: './order-page.component.html',
  styleUrls: ['./order-page.component.scss'],
  providers: [OrderService]
})
export class OrderPageComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('modal') modalRef: ElementRef
  modal: MaterialInstance
  isRoot: boolean
  pending: boolean = false
  oSub: Subscription
  @ViewChild('tapTarget') tapTargetRef: ElementRef
  tapTarget: MaterialInstance

  constructor(private router: Router,
              public order: OrderService,
              private ordersService: OrdersService) { }

  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }
  ngOnDestroy(): void {
    this.modal.destroy()
    if (this.oSub){
      this.oSub.unsubscribe()
    }
    this.tapTarget.destroy()
  }

  ngOnInit(): void {
    this.isRoot = this.router.url === '/order'
    this.router.events.subscribe( event => {
      if (event instanceof NavigationEnd) {
        this.isRoot = this.router.url === '/order'
      }
    })
  }

  openModal(){
    this.modal.open()
  }

  cancel(){
    this.modal.close()
  }
  submit(){
    this.pending = true
    const order: Order  = {
      list: this.order.list.map(
        item => {
          delete item._id
          return item
        }
      )
    }
    this.oSub = this.ordersService.create(order).subscribe(
      ordr =>{
        MaterialService.toast(`Order #${ordr.order} was added`)
        this.order.clear()
      },
      error =>MaterialService.toast(error.error.message),
      ()=>{
        this.modal.close()
        this.pending = false
      }
    )
  }

  removePosition(orderPosition: OrderPosition){
    this.order.remove(orderPosition)
  }

  openInfo(){
    this.tapTarget.open()
  }
}

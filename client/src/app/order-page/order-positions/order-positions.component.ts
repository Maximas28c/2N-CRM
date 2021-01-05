import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable, pipe } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionService } from 'src/app/shared/services/position.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-positions',
  templateUrl: './order-positions.component.html',
  styleUrls: ['./order-positions.component.scss']
})
export class OrderPositionsComponent implements OnInit {

  positions$: Observable<Position[]>

  constructor(private route: ActivatedRoute,
              private positionsServise: PositionService,
              private orderService: OrderService) { }

  ngOnInit(): void {
    this.positions$ = this.route.params
      .pipe(
        switchMap(
          (params: Params)=>{
            return this.positionsServise.fetch(params['id'])
          }
        ), map(
          (positions: Position[]) => {
            return positions
              .map( position =>{
                position.quantity = 1
                return position
              })
          }
        )
      )
  }

  addToOrder(position: Position) {
    MaterialService.toast(`added ${position.name} x ${position.quantity}pcs.`)
    this.orderService.add(position)

  }
}

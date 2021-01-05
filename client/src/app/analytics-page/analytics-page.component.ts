import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnalyticsPage } from '../shared/interfaces';
import { AnalyticsService } from '../shared/services/analytics.service';
import { Chart } from 'chart.js'
import { MaterialInstance, MaterialService } from '../shared/classes/material.service';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.scss']
})
export class AnalyticsPageComponent implements AfterViewInit, OnDestroy {
  
  @ViewChild('gain') gainRef: ElementRef
  @ViewChild('order') orderRef: ElementRef

  @ViewChild('tapTarget') tapTargetRef: ElementRef
  tapTarget: MaterialInstance

  aSub: Subscription
  average: number
  pending: boolean = true


  constructor(
    private analyticsService: AnalyticsService
  ) { }

  ngAfterViewInit(): void {
    const gainConfig: any = {
      label: 'Gain',
      color: 'rgb(250, 78, 150)'
    }

    const orderConfig: any = {
      label: 'Orders',
      color: 'rgb(32, 178, 215)'
    } 
    this.aSub = this.analyticsService.getAnalytics().subscribe((data: AnalyticsPage)=>{

      gainConfig.labels = data.chart.map(item => item.label)
      gainConfig.data = data.chart.map( item => item.gain)

      orderConfig.labels = data.chart.map(item => item.label)
      orderConfig.data = data.chart.map( item => item.order)

      // *** Temp demo data start

      // gainConfig.labels.push('31.12.2020')
      // gainConfig.labels.push('02.01.2021')
      // gainConfig.labels.push('03.01.2021')

      // gainConfig.data.push(56992)
      // gainConfig.data.push(120256)
      // gainConfig.data.push(13869)

      // orderConfig.labels.push('31.12.2020')
      // orderConfig.labels.push('02.01.2021')
      // orderConfig.labels.push('03.01.2021')

      // orderConfig.data.push(213)
      // orderConfig.data.push(385)
      // orderConfig.data.push(161)

      // *** Temp demo data end

      this.average = data.average

      const gainCtx = this.gainRef.nativeElement.getContext('2d')
      const orderCtx = this.orderRef.nativeElement.getContext('2d')
      gainCtx.canvas.height = '300px'
      orderCtx.canvas.height = '300px'

      new Chart(gainCtx, createChartConfig(gainConfig))
      new Chart(orderCtx, createChartConfig(orderConfig))

      this.pending = false
    })
    this.tapTarget = MaterialService.initTapTarget(this.tapTargetRef)
  }
  ngOnDestroy(): void {
    if (this.aSub) {
      this.aSub.unsubscribe()
    }
    this.tapTarget.destroy()
  }

  openInfo(){
    this.tapTarget.open()
  }

}

function createChartConfig ({labels, data, label, color}){
  return {
    type: 'line',
    options: {
      responsive: true
    },
    data: {
      labels,
      datasets:[
        {
          label,
          data,
          borderColor: color,
          steppedLine: false,
          fill: false
        }
      ]
    }
  }
}
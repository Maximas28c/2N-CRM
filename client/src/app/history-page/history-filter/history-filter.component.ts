import { Component, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MaterialDatePicker,MaterialService } from 'src/app/shared/classes/material.service';
import { Filter } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-history-filter',
  templateUrl: './history-filter.component.html',
  styleUrls: ['./history-filter.component.scss']
})
export class HistoryFilterComponent implements  OnDestroy, AfterViewInit {

  @Output() onFilter = new EventEmitter<Filter>()
  @ViewChild('start') startRef: ElementRef
  @ViewChild('end') endRef: ElementRef

  order: number
  start: MaterialDatePicker
  end: MaterialDatePicker

  isValid = true

  ngAfterViewInit(): void {
    this.start = MaterialService.initDatepicker(this.startRef, this.validate.bind(this))
    this.end = MaterialService.initDatepicker(this.endRef, this.validate.bind(this))
  }
  ngOnDestroy(): void {
    this.start.destroy()
    this.end.destroy()
  }

  submitFilter(){
    const filter: Filter = {

    }

    if (this.order){
      filter.order = this.order
    }

    if (this.start.date) {
      filter.start = this.start.date
    }
    if (this.end.date) {
      filter.end = this.end.date
    }

    this.onFilter.emit(filter)
  }

  validate(){
    if ( !this.start.date || !this.end.date ){
      this.isValid = true
      return 
    }
    this.isValid = this.start.date < this.end.date
  }

}

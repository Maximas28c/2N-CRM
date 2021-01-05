import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MaterialInstance, MaterialService } from 'src/app/shared/classes/material.service';
import { Position } from 'src/app/shared/interfaces';
import { PositionService } from 'src/app/shared/services/position.service';

@Component({
  selector: 'app-position-form',
  templateUrl: './position-form.component.html',
  styleUrls: ['./position-form.component.scss']
})
export class PositionFormComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('modal') modalRef!: ElementRef
  @Input('categoryId') categoryId!: string;
  positions: Position[] = []
  loading = false
  modal!: MaterialInstance
  form!: FormGroup
  positionId = null

  constructor(private positionService: PositionService) {

  }
  ngOnDestroy(): void {
    this.modal.destroy
  }
  ngAfterViewInit(): void {
    this.modal = MaterialService.initModal(this.modalRef)
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      cost: new FormControl(1, [Validators.required,Validators.min(1),])
    })

    this.loading = true
    this.positionService.fetch(this.categoryId).subscribe(positions =>{
      this.positions = positions
      this.loading = false
    })
  }

  onSelectPosition(position: Position){
    this.positionId = position._id
    this.form.patchValue({
      name: position.name,
      cost: position.cost
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }
  
  onAddPositon(){
    this.positionId = null
    this.form.reset({
      name: '',
      cost: 1
    })
    this.modal.open()
    MaterialService.updateTextInputs()
  }
  onCancel(){
    this.modal.close()
  }
  onSubmit(){
    this.form.disable()

    const newPosition: Position = {
      name: this.form.value.name,
      cost: this.form.value.cost,
      category: this.categoryId
    }

    const onComplete = () => {
      this.modal.close()
      this.form.reset({name:'',cost: 1})
      this.form.enable()
    }

    if (this.positionId){
      newPosition._id = this.positionId
      this.positionService.update(newPosition).subscribe(
        position => {
          const idx = this.positions.findIndex(p => p._id === position._id)
          this.positions[idx] = position 
          MaterialService.toast('Position was updated')
          this.positions.push(position)
        }, error => MaterialService.toast(error.error.message),
        onComplete
      )
    } else {
      this.positionService.create(newPosition).subscribe(
        position => {
          MaterialService.toast('Position was created')
          this.positions.push(position)
        }, error => MaterialService.toast(error.error.message),
        onComplete
      )
    }
  }
  onDeletePosition(event: Event, position: Position){
    event.stopPropagation()
    const decision = window.confirm(`Are you sure to delete position"${position.name}"`)

    if (decision){
      this.positionService.delete(position).subscribe(
        response =>{
          const idx = this.positions.findIndex(p=>p._id === position._id)
          this.positions.splice(idx,1)
          MaterialService.toast(response.message)
        },
        error => MaterialService.toast(error.error.message)
      )
    }
  }
}

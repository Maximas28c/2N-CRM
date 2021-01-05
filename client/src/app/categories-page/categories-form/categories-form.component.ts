import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Category } from 'src/app/shared/interfaces';
import { CategoriesService } from 'src/app/shared/services/categories.service';

@Component({
  selector: 'app-categories-form',
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {

  @ViewChild('input') inputRef!: ElementRef;

  form!: FormGroup;
  isNew = true;
  image!: File;
  imagePreview: any;

  category!: Category;

  constructor( private route: ActivatedRoute, 
               private categoriesServise: CategoriesService,
               private router: Router ) 
  { }

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required)
    })

    this.form.disable()

    this.route.params
      .pipe(
        switchMap(
          (params: Params) => {
            if(params['id']) {
              this.isNew = false
              return this.categoriesServise.getById(params['id'])
            }
            return of (null)
          }
        )
      ).subscribe(
        category => {
          if (category){
            this.category = category
            this.form.patchValue({
              name: category.name
            })
            MaterialService.updateTextInputs()
            this.imagePreview = category.imageSrc
          }
          this.form.enable()
        },
        error => MaterialService.toast(error.error.message)
        )

  }

  triggerClick(){
    this.inputRef.nativeElement.click()
  }

  deleteCategory(){
    const decision = window.confirm(`Are you sure that you whant to delete category"${this.category.name}"`)

    if(decision){
      this.categoriesServise.delete(this.category._id)
        .subscribe(
          response => MaterialService.toast(response.message),
          error => MaterialService.toast(error.error.message),
          ()=>this.router.navigate(['/categories'])
          )
    }

  }

  onFileUpload(event: any){
    const file = event.target.files[0]
    this.image = file
    const reader = new FileReader

    reader.onload = () => {
      this.imagePreview = reader.result
    }

    reader.readAsDataURL(file)
  }

  onSubmit(){
    let obs$
    this.form.disable()

    if (this.isNew) {
      obs$ = this.categoriesServise.create(this.form.value.name, this.image)
    } else {
      obs$ = this.categoriesServise.update( this.category._id ,this.form.value.name, this.image)
    }

    obs$.subscribe(
      category =>{
        this.form.enable()
        MaterialService.toast('Your change saved')
        this.category = category
      },
      error => {
        this.form.enable()
        MaterialService.toast(error.error.message)
      }
    )
  }

}

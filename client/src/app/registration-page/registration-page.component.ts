import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';
import { User } from '../shared/interfaces';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-registration-page',
  templateUrl: './registration-page.component.html',
  styleUrls: ['./registration-page.component.scss']
})
export class RegistrationPageComponent implements OnInit, OnDestroy {

  form = new FormGroup({
    'email': new FormControl(null,[Validators.required, Validators.email]),
    'password': new FormControl(null,[Validators.required, Validators.minLength(6)])
  })

  aSub: Subscription = new Subscription;

  constructor(private auth: AuthService, 
              private router: Router,
              private route: ActivatedRoute,
              private http: HttpClient) {

  }
  ngOnDestroy(): void {
    if (this.aSub){
      this.aSub.unsubscribe()
    }
  }



  ngOnInit(): void {
  }

  onSubmit() {
    this.form.disable()
    this.aSub = this.auth.registration(this.form.value).subscribe(
      ()=>{
        this.router.navigate(['/login'], {queryParams:{
          registred: true
        }})
      },
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable
      }
    )
  }
}

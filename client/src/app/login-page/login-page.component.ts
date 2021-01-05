import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MaterialService } from '../shared/classes/material.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  

  form = new FormGroup({
    'email': new FormControl(null,[Validators.required, Validators.email]),
    'password': new FormControl(null,[Validators.required, Validators.minLength(6)])
  })

  aSub: Subscription = new Subscription;

  constructor(private auth: AuthService, 
              private router: Router,
              private route: ActivatedRoute) {

  }
  

  ngOnDestroy(): void {
    if (this.aSub){
      this.aSub.unsubscribe()
    }
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Params)=>{
      if (params['registred']){
        MaterialService.toast('now you can enter, using you sing in data')
      } else if (params['accessDenied']) {
        MaterialService.toast('You need to sing in')
      } else if (params['sessionFailed']){
        MaterialService.toast('You session is expiried')
      }
    })
  }
  onSubmit() {
    this.form.disable()
    this.aSub = this.auth.login(this.form.value).subscribe(
      () => this.router.navigate(['/overview']),
      error => {
        MaterialService.toast(error.error.message)
        this.form.enable()
      }
    )
    this.form.enable()
  }

}

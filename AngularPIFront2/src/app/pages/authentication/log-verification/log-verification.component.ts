import { HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-log-verification',
  templateUrl: './log-verification.component.html',
  styleUrls: ['./log-verification.component.scss']
})
export class LogVerificationComponent {
  loginForm!: FormGroup;


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService :UserService ,

  ) {}
  ngOnInit():void {
    this.loginForm= this.formBuilder.group({
      token : [null, [Validators.required]],
    })
  }

  Veriftoken(loginForm: FormGroup) {
    if (loginForm.value.token !== "" ) {
      this.userService.verifyToken(loginForm.value.token).subscribe(
        (response: any) => {
          localStorage.setItem('token', loginForm.value.token);
          Swal.fire({
            title:"Authenticated successfully!",
            text: "You clicked the button!",
            icon: "success"
          })
          this.router.navigate(['/dashboard']);

        },
        (error) => {
            // Handle error
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Wrong Token !!'
            });
        }
    );

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You should type your Token'
      });
    }
  }


  onSubmit(loginForm: FormGroup){
    this.Veriftoken(loginForm)
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-resetpassemail',
  templateUrl: './resetpassemail.component.html',
  styleUrls: ['./resetpassemail.component.scss']
})
export class ResetpassemailComponent {
  loginForm!: FormGroup;


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService :UserService ,

  ) {}
  ngOnInit():void {
    this.loginForm= this.formBuilder.group({
      email : [null, [Validators.required]],
    })
  }

  sendEmail(loginForm: FormGroup) {
    if (loginForm.value.token !== "" ) {
      this.userService.getUserByEmail(loginForm.value.email).subscribe(
        (response: any) => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Check your email !!",
            showConfirmButton: false,
            timer: 3000
          });        },
        (error) => {
            // Handle error
            console.log(error);
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Can not find any user with these email !!'
            });
        }
    );

    } else {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'You should type your Email'
      });
    }
  }
}

import { Component,Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ResReq } from 'src/app/core/ResReq';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-resetpwd',
  templateUrl: './resetpwd.component.html',
  styleUrls: ['./resetpwd.component.scss']
})
export class ResetpwdComponent {
  id!: string;
  resReq: ResReq = { newPass: '', confirmPass: '' }; // Define resReq object
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService :UserService ,

    ) {}
    ngOnInit(): void {
      this.id = this.route.snapshot.params['id'];
    }
    onSubmit() {
      if(this.resReq.confirmPass!=="" && this.resReq.newPass!=="" ){
        if(this.resReq.confirmPass==this.resReq.newPass){
          console.warn(this.id)
          this.userService.resetPwd(this.id,this.resReq).subscribe(
            (response: any) => {
              console.warn(response)
              this.router.navigate(['/authentication/login']);
            },
            (error) => {
                // Handle error
                console.log(error);
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Error !!'
                });
            }
        );

        }else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You should verifie your confirm Password'
        });
      }
      }else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'You should type reset Password'
        });
      }
      console.log(this.resReq); // Access new password
    }

}

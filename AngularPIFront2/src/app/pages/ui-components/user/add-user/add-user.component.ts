import { Component } from '@angular/core';
import { Role, User } from '../User';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent {

  newUser: User = {
    id: 0,
    name: '',
    lastName: '',
    email: '',
    role: Role.STUDENT,
    address: '',
    roles:[]
  };
  roles: string[] = Object.values(Role);

    constructor(
      private router: Router,
      private userservice: UserService,
      public dialogRef: MatDialogRef<AddUserComponent>

    ) {}
    onNoClick(): void {
      this.dialogRef.close();
    }


    addUser(): void {
      this.userservice.createUser(this.newUser).subscribe(
        (response) => {
          console.log('User added successfully:', response);
          this.router.navigate(['/ui-components/user']);
        },
        (error) => {
          console.error('Error adding user:', error);
        }

      );
      this.router.navigate(['/user-list']);
    }

}


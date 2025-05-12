import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Role, User } from '../User';
import { UserService } from 'src/app/services/user.service';
import { catchError, throwError } from 'rxjs';


@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.scss']
})
export class UpdateUserComponent {
  roles: Role[]=[];
  constructor(
    public dialogRef: MatDialogRef<UpdateUserComponent>,
    @Inject(MAT_DIALOG_DATA) public data: User,
    private userservice: UserService
  ) {}

  updateUser(user: any): void {
   this.roles.push(user.role);
   user.roles=this.roles
    this.userservice.updateUser(this.data.id, user).subscribe(
      (response: any) => {
        console.log('User updated successfully:', response);
        this.dialogRef.close(true);
      },
      (error: any) => {
        console.error('Error updating user:', error.error); // Access the error message from the error object
      }
    );
  }

  onClose(): void {
    this.dialogRef.close(false);
  }
}

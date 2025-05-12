import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/core/User';
import { UserService } from 'src/app/services/user.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { UpdateTaskComponent } from '../task/update-task/update-task.component';
import { UpdateUserComponent } from './update-user/update-user.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService, private router: Router, public dialog: MatDialog) { }
  openAddDialog(): void {
    const dialogRef = this.dialog.open(AddUserComponent, {});

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.fetchUsers();
    });
  }
  openUpdateDialog(id: number): void {
    const dialogRef = this.dialog.open(UpdateUserComponent, {
      data: { taskId: id, ...this.users.find(users => users.id === id) }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.fetchUsers();
    });
  }

  ngOnInit(): void {
    this.userService.getUsers().subscribe((data: User[]) => {
      this.users = data;
      this.fetchUsers();

    });
  }
  fetchUsers(): void {
    this.userService.getUsers().subscribe(
      (users) => {
        this.users = users;
        console.warn(users)
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );

  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe(() => {
        this.users = this.users.filter(user => user.id !== id);
      },
      error => {
        console.error('Error deleting :', error);
      });
    }
  }
}

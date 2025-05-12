import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html'
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  userForm: FormGroup;
  isEditMode = false;
  selectedUserId: number | null = null;
  searchTerm: string = '';

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router,private userService:UserService) {
    this.userForm = this.fb.group({
      first_name: [''],
      last_name: [''],
      email: [''],
      role: [''],
      password: [''] // Required for new users, optional for edits
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:5000/users').subscribe(data => {
      this.users = data;
    });
  }

  submitForm() {
    const formData = this.userForm.value;

    if (this.isEditMode && this.selectedUserId !== null) {
      this.http.put(`http://localhost:5000/users/${this.selectedUserId}`, formData).subscribe(() => {
        this.resetForm();
        this.loadUsers();
      });
    } else {
      this.http.post('http://localhost:5000/signup', formData).subscribe(() => {
        this.resetForm();
        this.loadUsers();
      });
    }
  }

  editUser(user: any) {
    this.userForm.patchValue(user);
    this.selectedUserId = user.id;
    this.isEditMode = true;
  }

  deleteUser(id: number) {
    if (confirm('Voulez-vous vraiment supprimer cet utilisateur ?')) {
      this.http.delete(`http://localhost:5000/users/${id}`).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  resetForm() {
    this.userForm.reset();
    this.isEditMode = false;
    this.selectedUserId = null;
  }

 logout() {
    this.userService.logout();
    this.router.navigate(['/authentication/login']);
  }
  

  get filteredUsers() {
    if (!this.searchTerm) return this.users;
    return this.users.filter(user =>
      user.last_name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
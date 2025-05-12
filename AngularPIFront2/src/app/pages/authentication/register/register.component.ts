import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class AppSideRegisterComponent implements OnInit {
  registerForm!: FormGroup;
  roles: string[] = ['administrative_responsible', 'employability_responsible', 'admin'];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  register(): void {
    if (this.registerForm.valid) {
      const formData = this.registerForm.value;

      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role
      };

      console.log('Payload:', payload);

      this.http.post<any>('http://localhost:5000/signup', payload).subscribe({
        next: (res) => {
          this.snackBar.open('Signup successful!', 'Close', { duration: 3000 });

          // Redirection selon le rôle
          switch (formData.role) {
            case 'admin':
              this.router.navigate(['/admin']);
              break;
            case 'administrative_responsible':
              this.router.navigate(['/administrative']);
              break;
            case 'employability_responsible':
              this.router.navigate(['/employability']);
              break;
            default:
              this.router.navigate(['/authentication/login']);
              break;
          }
        },
        error: (err) => {
          console.error('Signup failed:', err);
          const msg = err?.error?.message || 'Signup failed';
          this.snackBar.open(msg, 'Close', { duration: 5000 });
        }
      });
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent implements OnInit {
  loginForm!: FormGroup;
  hidePassword = true;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
  if (this.loginForm.valid) {
    const loginData = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };

    this.userService.login(loginData).subscribe(
      (response: any) => {
        console.log('Connexion réussie', response);
        const role = response.role;

        this.userService.setRoles(role); // optionnel
        localStorage.setItem('role', role);

        // Redirection par rôle
        if (role === 'admin') {
          this.router.navigate(['/admin']);
        } else if (role === 'administrative_responsible') {
          this.router.navigate(['/home']);
        } else if (role === 'employability_responsible') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/unauthorized']);
        }
      },
      (error) => {
        console.error('Erreur de connexion', error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.error?.message || 'Erreur lors de la connexion',
        });
      }
    );
  } else {
    Swal.fire({
      icon: 'warning',
      title: 'Champs manquants',
      text: 'Veuillez saisir votre email et mot de passe.',
    });
  }
}
}
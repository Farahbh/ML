import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Vérifier si l'utilisateur est connecté
    const isLoggedIn = this.userService.isLoggedIn(); // Méthode à implémenter dans UserService
    if (!isLoggedIn) {
      this.router.navigate(['/authentication/login']);
      return false;
    }

    // Vérifier le rôle de l'utilisateur
    const userRole = localStorage.getItem('role');
    const allowedRoles = route.data['roles'] as string[]; // Rôles autorisés définis dans la route

    if (allowedRoles && userRole && allowedRoles.includes(userRole)) {
      return true; // L'utilisateur a le bon rôle
    }

    // Rediriger vers une page non autorisée si le rôle ne correspond pas
    this.router.navigate(['/unauthorized']);
    return false;
  }
}
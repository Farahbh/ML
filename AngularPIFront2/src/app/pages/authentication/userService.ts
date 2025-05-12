// user.service.ts
export class UserService {
  setRoles(role: string) {
    localStorage.setItem('role', role);
  }

  getRole(): string {
    return localStorage.getItem('role') || '';
  }
}

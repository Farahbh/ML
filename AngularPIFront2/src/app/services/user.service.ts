import { Injectable, Component } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { RegUser } from '../pages/authentication/RegUser';
import { User } from '../core/User';
import { Router } from '@angular/router';
import { ResReq } from '../core/ResReq';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api/users';
  private url = 'http://localhost:8081/api/getUEml';
  private urlmail = 'http://localhost:8081/api/getbyml';

  private url2 = 'http://localhost:8081/api/resetPwd';
  private url3 = 'http://localhost:8081/api/changeImg';

  private AuthURL = "http://localhost:8081/api/auth/signin"
  private VerifURL = "http://localhost:8081/api/auth/verif"

  private RegURL = "http://localhost:8081/api/auth/signup"

  rollls!:any
  id!:any


  constructor(private http: HttpClient,private router: Router) { }
  setRoles(role: string) {
    localStorage.setItem('role', role);
  }
logout() {
    localStorage.removeItem('role');
  }
  isLoggedIn(): boolean {
    // Vérifiez si un token ou un rôle existe dans localStorage (ou autre mécanisme)
    return !!localStorage.getItem('role'); // Exemple simple
  }
  getRole(): string {
    return localStorage.getItem('role') || '';
  }
  resetPwd(id: any, resReq: ResReq): Observable<User> {
    console.warn(resReq)
    const url = `${this.url2}/${id}`;
    return this.http.put<User>(url, resReq);
  }
  changeImg(id:any,image: any): Observable<User> {
    const url = `${this.url3}/${id}`;
    return this.http.put<User>(url, image);
  }
  createUser(user: any): Observable<User> {
    return this.http.post<User>(this.baseUrl, user);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl);
  }
  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`);
  }
  getUserByEmail(email: number): Observable<User> {
    return this.http.get<User>(`${this.url}/${email}`);
  }
  getByml(email: any): Observable<User> {
    return this.http.get<User>(`${this.urlmail}/${email}`);
  }
  updateUser(id: any, updatedUser: User): Observable<User> {
    console.warn(updatedUser)
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<User>(url, updatedUser);
  }
  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  login(data: { email: string, password: string }) {
    return this.http.post('http://localhost:5000/login', data);
  }
  
  public getToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  register(user:RegUser){
    console.log(user)
    return this.http.post<any>(`${this.RegURL}`,user);
  }

  /*public setRoles(response: any) {
    // Check if the response object contains the 'roles' property
    if (!response || !response.roles || !Array.isArray(response.roles)) {
      this.rollls =  [];
    }

    // Extract roles from the response object
    const roles: string[] = response.roles;

    this.rollls = roles;
  }*/

  public setId(response: any) {
    // Check if the response object contains the 'roles' property
    if (!response || !response.roles || !Array.isArray(response.roles)) {
      this.id =  [];
    }

    // Extract roles from the response object
    const id: string = response.id;

    this.id = id;
  }
  getRoles(){
    return this.rollls
  }
  public clear() {
    localStorage.clear();
  }

  public logOut(){
    return localStorage.removeItem('token')
  }
  logoutUser(){
    this.logOut();
    this.clear();
    this.router.navigate([''])
  }

  verifyToken(token:String):Observable<HttpResponse<any>>{
    return this.http.get<any>(`${this.VerifURL}/${token}`);
  }
  getUserImg(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${this.id}`);
  }
}

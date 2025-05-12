import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {
private apiUrl = 'http://localhost:5000/chat'; // URL de ton endpoint Flask

  constructor(private http: HttpClient) {}

  sendMessage(message: string): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(this.apiUrl, { message }).pipe(
      catchError((error) => {
        throw new Error('Erreur lors de l\'envoi du message : ' + error.message);
      })
    );
  }
}

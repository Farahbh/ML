import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Task } from '../core/Task';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private baseUrl = 'http://localhost:8081/api/tasks';

  constructor(private http: HttpClient) { }

  createTask(task: Task): Observable<Task> {
    return this.http.post<Task>(this.baseUrl, task);
  }
  getAllTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(this.baseUrl);
  }
  deleteTask(taskId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${taskId}`);
  }
  updateTask(taskId: number, updatedTask: Task): Observable<Task> {
    const url = `${this.baseUrl}/${taskId}`;
    return this.http.put<Task>(url, updatedTask);
  }
  getTaskById(taskId: number): Observable<Task> {
    const url = `${this.baseUrl}/${taskId}`;
    return this.http.get<Task>(url);
  }
}

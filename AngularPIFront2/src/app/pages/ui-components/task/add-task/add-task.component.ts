import { TaskService } from 'src/app/services/task.service';
import { Component } from '@angular/core';

import { Task } from 'src/app/core/Task';
import { User } from 'src/app/core/User';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
})
export class AddTaskComponent {
  taskId: number;
  taskDescription: string = '';
  progress: string = '';
  duration: string = '';
  supervisorId: number = 2;
  studentId: number = 3;

  constructor(
    private router: Router,
    private taskService: TaskService,
    public dialogRef: MatDialogRef<AddTaskComponent>

  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  addTask(): void {
    const newTask: Task = {
      id: this.taskId,
      taskDescription: this.taskDescription,
      progress: this.progress,
      duration: this.duration,
      supervisor: { id: this.supervisorId } as User,
      student: { id: this.studentId } as User,
    };
    this.taskService.createTask(newTask).subscribe(
      (response) => {
        console.log('Task added successfully:', response);
        this.router.navigate(['/ui-components/task']);
      },
      (error) => {
        console.error('Error adding task:', error);
      }
    );
  }
}

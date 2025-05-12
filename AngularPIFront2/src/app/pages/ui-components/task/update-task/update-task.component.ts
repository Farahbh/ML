import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from 'src/app/core/Task';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-update-task',
  templateUrl: './update-task.component.html',
  styleUrls: ['./update-task.component.scss']
})
export class UpdateTaskComponent {
  constructor(
    public dialogRef: MatDialogRef<UpdateTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private taskService: TaskService
  ) {}

  updateTask(task: Task): void {
    this.taskService.updateTask(this.data.id, task).subscribe(
      (response) => {
        console.log('Task updated successfully:', response);
        this.dialogRef.close(true);
      },
      (error) => {
        console.error('Error updating task:', error);
      }
    );
  }

  onClose(): void {
    this.dialogRef.close(false); 
  }
}

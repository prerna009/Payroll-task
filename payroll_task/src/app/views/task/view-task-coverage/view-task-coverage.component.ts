import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TaskService } from '../../../core/services/task.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-view-task-coverage',
  templateUrl: './view-task-coverage.component.html',
  styleUrl: './view-task-coverage.component.scss',
})
export class ViewTaskCoverageComponent {
  taskCoverage: any = [];

  constructor(
    public dialogRef: MatDialogRef<ViewTaskCoverageComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public taskService: TaskService
  ) {}

  ngOnInit() {
    this.taskService
      .getViewTask(this.data.taskId)
      .pipe(
        map((res) => {
          if (res.Status === 200) {
            for (let status in res.data) {
              let name = status;
              if (status === 'Not Started') name = 'Not Accepted';
              else if (status === 'Pending') name = 'Partial Complete';
              this.taskCoverage.push({ Name: name, Count: res.data[status] });
            }
          }
        })
      )
      .subscribe();
  }

  onClick(): void {
    this.dialogRef.close();
  }
}

import { Component, Inject, OnInit } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { map } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-partial-complete-status',
  templateUrl: './partial-complete-status.component.html',
  styleUrl: './partial-complete-status.component.scss',
  standalone: false
})
export class PartialCompleteStatusComponent implements OnInit {
  partialData: any[] = [];
  partialValue: number = 0;
  selectedValue: number = 0;
  isChanged: boolean = false;
  isLoading: boolean = false;

  constructor(
    private taskService: TaskService,
    public dialogRef: MatDialogRef<PartialCompleteStatusComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.partialValue = this.data.CompletionPercentage;
    this.taskService
      .getPartialTaskStatus()
      .pipe(map((res) => (this.partialData = res.data)))
      .subscribe();
  }

  taskValue(value: number) {
    this.partialValue = value;
    this.selectedValue = value;
    this.isChanged = true;
  }

  onSubmit() {
    this.isLoading = true;
    this.taskService
      .updateTaskStatus(this.data.taskId, this.partialValue)
      .pipe(
        map((res) => {
          if (res.Status === 200) {
            this.dialogRef.close({ res, isEdit: true });
          }
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  onClick() {
    this.dialogRef.close();
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskComponent } from './task.component';
import { RouterModule, Routes } from '@angular/router';
import { MyTaskComponent } from './sub-component/my-task/my-task.component';
import { CcComponent } from './sub-component/cc/cc.component';
import { AssignedByMeComponent } from './sub-component/assigned-by-me/assigned-by-me.component';
import { ArchiveListComponent } from './sub-component/archive-list/archive-list.component';
import { SharedModule } from '../../core/shared/modules/shared.module';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { PartialCompleteStatusComponent } from './partial-complete-status/partial-complete-status.component';
import { ViewTaskCoverageComponent } from './view-task-coverage/view-task-coverage.component';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { AddUsersDialogComponent } from './add-users-dialog/add-users-dialog.component';
import { unsavedAlertGuard } from '../../core/guards/unsaved-alert.guard';

const routes : Routes = [
  {
    path : '',
    component : TaskComponent,
    children: [
      {
        path : 'add-task',
        component : AddTaskDialogComponent,
        canDeactivate : [unsavedAlertGuard]
      }
    ]
  },
]

@NgModule({
  declarations: [
    TaskComponent,
    MyTaskComponent,
    CcComponent,
    AssignedByMeComponent,
    ArchiveListComponent,
    ConfirmDialogComponent,
    PartialCompleteStatusComponent,
    ViewTaskCoverageComponent,
    AddTaskDialogComponent,
    AddUsersDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMatSelectSearchModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TaskModule { }

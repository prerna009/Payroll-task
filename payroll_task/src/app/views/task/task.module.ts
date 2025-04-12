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

const routes : Routes = [
  {
    path : '',
    component : TaskComponent
  }
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
    ViewTaskCoverageComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class TaskModule { }

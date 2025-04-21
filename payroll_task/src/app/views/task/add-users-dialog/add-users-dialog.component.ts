import { Component, Inject, OnInit } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';

@Component({
    selector: 'app-add-users-dialog',
    templateUrl: './add-users-dialog.component.html',
    styleUrl: './add-users-dialog.component.scss',
    standalone: false
})
export class AddUsersDialogComponent implements OnInit {
  memberList: any[] = [];
  userIds: any[] = [];
  removeUserList: any[] = [];
  removeUserDetails: any[] = [];
  viewLoading: boolean = false;
  noRecords: boolean = false;
  showRemoveUser: boolean = false;
  addRemove: boolean = false;
  totalRecords: number = 0;
  lastRowIndex: number = 0;

  constructor(
    private taskService: TaskService,
    public dialogRef: MatDialogRef<AddUsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if (this.data.usersData) {
      this.showRemoveUser = true;
      this.removeUserDetails = this.data.usersData;
    } else if (this.data.usersIds?.length > 0) {
      this.addRemove = true;
      if (this.data.controlname === 'UserIds') {
        this.userIds = this.data.usersIds.map((id: number) => ({ UserId: id }));
      } else if (this.data.controlname === 'TaskOwners') {
        this.userIds = [...this.data.usersIds]; 
      }
    }
    this.getMembersList(1, 100, '');
  }

  getMembersList(from: number, to: number, searchText: string): void {
    this.taskService
      .getCompanyMembers(from, to, searchText)
      .pipe(
        map((res) => {
          Array.prototype.push.apply(this.memberList, res.data.Members);
          this.totalRecords = res.data.TotalRecords;
          this.lastRowIndex = this.memberList.length;
          this.viewLoading = false;
          this.markSelectedMembers();
        })
      )
      .subscribe();
  }

  searchMember(searchValue: string): void {
    this.viewLoading = true;
    this.taskService
      .getCompanyMembers(1, this.totalRecords, searchValue)
      .pipe(
        map((res) => {
          this.memberList = res.data.Members || [];
          this.noRecords = !this.memberList.length;
          this.viewLoading = false;
          this.markSelectedMembers();
        })
      )
      .subscribe();
  }

  checkedMember(event: any, userId: number, memberName: string): void {
    const isChecked = event.checked;

    if (this.showRemoveUser) {
      const entry = this.data.Action === 'Owner' ? { UserId: userId } : userId;
      if (isChecked) {
        const alreadyExists = this.removeUserList.some((x: any) =>
          typeof x === 'object' ? x.UserId === userId : x === userId
        );
        if (!alreadyExists) this.removeUserList.push(entry);
      } else {
        const index = this.removeUserList.findIndex((x: any) =>
          typeof x === 'object' ? x.UserId === userId : x === userId
        );
        if (index !== -1) this.removeUserList.splice(index, 1);
      }
      return;
    }

    if (isChecked) {
      const alreadyExists = this.userIds.some((u: any) => u.UserId === userId);
      if (!alreadyExists) {
        this.userIds.push({ UserId: userId, Name: memberName });
      }
    } else {
      const index = this.userIds.findIndex((x: any) => x.UserId === userId);
      if (index !== -1) this.userIds.splice(index, 1);
    }
  }

  markSelectedMembers(): void {
    this.memberList.forEach((member) => {
      const isAlreadySelected = this.userIds.some(
        (u: any) => u.UserId === member.UserId
      );
      member.isChecked = isAlreadySelected;
    });
  }

  onSubmit(): void {
    if (this.showRemoveUser) {
      const action =
        this.data.Action === 'Owner'
          ? this.taskService.removeOwnerTask(
              this.data.taskId,
              this.removeUserList
            )
          : this.taskService.removeUsersExistingTask(
              this.data.taskId,
              this.removeUserList
            );

      action
        .pipe(
          map((res: any) => {
            if (res.Status === 200) this.dialogRef.close({ isEdit: true });
          })
        )
        .subscribe();
    } else {
      this.dialogRef.close({ members: this.userIds, isEdit: true });
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

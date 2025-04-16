import { Component, Inject, OnInit } from '@angular/core';
import { TaskService } from '../../../core/services/task.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { map } from 'rxjs';

@Component({
  selector: 'app-add-users-dialog',
  templateUrl: './add-users-dialog.component.html',
  styleUrl: './add-users-dialog.component.scss',
})
export class AddUsersDialogComponent implements OnInit {
  memberList: any[] = [];
  viewLoading: boolean = false;
  totalRecords: number = 0;
  noRecords: boolean = false;
  userIds: any[] = [];
  removeUserList: any[] = [];
  showRemoveUser: boolean = false;
  addRemove: boolean = false;
  removeUserDetails: any[] = [];
  previousFromRow: number = 1;
  previousToRow: number = 10;
  lastRowIndex: number = 0;

  constructor(
    private taskService: TaskService,
    public dialogRef: MatDialogRef<AddUsersDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    if (this.data?.usersData) {
      this.showRemoveUser = true;
    } else if (this.data?.usersIds?.length > 0) {
      this.addRemove = true;
    }

    const from =
      this.showRemoveUser || this.addRemove ? 1 : this.previousFromRow;
    const to = this.showRemoveUser || this.addRemove ? 100 : this.previousToRow;

    this.getMembersList(from, to, '');
  }

  getMembersList(from: number, to: number, searchText: string): void {
    this.viewLoading = true;
    this.taskService
      .getCompanyMembers(from, to, searchText)
      .pipe(
        map((res) => {
          const members = res?.data?.Members || [];
          if (searchText) {
            this.memberList = members;
          } else {
            this.memberList.push(...members);
          }
          this.totalRecords = res?.data?.TotalRecords || 0;
          this.lastRowIndex = this.memberList.length;
          this.viewLoading = false;
          this.markSelectedMembers();
        })
      )
      .subscribe();
  }

  onscroll(event: any): void {
    const pos = event.target.scrollTop + event.target.offsetHeight;
    const max = event.target.scrollHeight;

    if (pos >= max && this.previousToRow < this.totalRecords) {
      this.previousFromRow += 10;
      this.previousToRow += 10;
      this.getMembersList(this.previousFromRow, this.previousToRow, '');
    }
  }

  searchMember(searchValue: string): void {
    this.getMembersList(1, this.totalRecords, searchValue);
    this.noRecords = this.memberList.length === 0;
  }

  checkedMember(event: any, userId: number, memberName: string): void {
    const isChecked = event.checked;
    if (isChecked) {
      if (this.showRemoveUser) {
        const userObj =
          this.data.Action === 'Owner' ? { UserId: userId } : userId;
        this.removeUserList.push(userObj);
      } else {
        this.userIds.push({ UserId: userId, Name: memberName });
      }
    } else {
      if (this.showRemoveUser) {
        this.removeUserList = this.removeUserList.filter((x: any) =>
          this.data.Action === 'Owner' ? x.UserId !== userId : x !== userId
        );
      } else {
        this.userIds = this.userIds.filter((x: any) => x.UserId !== userId);
      }
    }
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
            if (res?.Status === 200) {
              this.dialogRef.close({ isEdit: true });
            }
          })
        )
        .subscribe();
      this.taskService
        .removeOwnerTask(this.data.taskId, this.removeUserList)
        .pipe(
          map((res: any) => {
            if (res.Status === 200) {
              this.dialogRef.close({ isEdit: true });
            }
          })
        )
        .subscribe();
    } else {
      this.dialogRef.close({ members: this.userIds, isEdit: true });
    }
  }

  markSelectedMembers(): void {
    const { usersIds = [], controlname } = this.data;
    this.userIds = [];
    if (!usersIds?.length) return;

    this.memberList.forEach((member) => {
      if (controlname === 'UserIds') {
        if (usersIds.includes(member.UserId)) {
          member.isChecked = true;
          this.userIds.push({ UserId: member.UserId, Name: member.Name });
        }
      } else if (controlname === 'TaskOwner') {
        const match = usersIds.find((u: any) => u.UserId === member.UserId);
        if (match) {
          member.isChecked = true;
          this.userIds.push(match);
        }
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

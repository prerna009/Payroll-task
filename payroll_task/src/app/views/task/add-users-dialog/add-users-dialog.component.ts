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
      this.removeUserDetails = this.data.usersData;
      console.log(this.removeUserDetails);
    } else if (this.data?.usersIds?.length > 0) {
      this.addRemove = true;
    }
    this.previousFromRow = 1;
    this.previousToRow = 10;
    this.getMembersList(this.previousFromRow, this.previousToRow, '');
  }

  getMembersList(from: number, to: number, searchText: string): void {
    this.viewLoading = true;
    this.taskService
      .getCompanyMembers(from, to, searchText)
      .pipe(
        map((res) => {
          const members = res.data.Members || [];
          if (from === 1) {
            this.memberList = members;
          } else {
            this.memberList = [...this.memberList, ...members];
          }
          this.totalRecords = res.data.TotalRecords;
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

    if (pos >= max && this.lastRowIndex < this.totalRecords) {
      this.previousFromRow += 10;
      this.previousToRow += 10;
      this.getMembersList(this.previousFromRow, this.previousToRow, '');
    }
  }

  searchMember(searchValue: string): void {
    this.viewLoading = true;
    this.taskService
      .getCompanyMembers(1, this.totalRecords || 100, searchValue)
      .pipe(
        map((res) => {
          this.memberList = res.data.Members || [];
          this.noRecords = this.memberList.length === 0;
          this.markSelectedMembers();
          this.viewLoading = false;
        })
      )
      .subscribe();
  }

  checkedMember(event: any, userId: number, memberName: string): void {
    if (event.isChecked) {
      if (this.showRemoveUser) {
        if (this.data.Action === 'Owner') {
          this.removeUserList.push({ UserId: userId });
        } else {
          this.removeUserList.push(userId);
        }
      } else {
        const params = { UserId: userId, Name: memberName };
        this.userIds.push(params);
      }
    } else {
      if (this.showRemoveUser) {
        const index = this.removeUserList.findIndex((x: any) =>
          typeof x === 'object' ? x.UserId === userId : x === userId
        );
        if (index !== -1) this.removeUserList.splice(index, 1);
      } else {
        const index = this.userIds.findIndex((x) => x.UserId === userId);
        if (index > -1) this.userIds.splice(index, 1);
      }
    }
    const member = this.memberList.find((m) => m.UserId === userId);
    if (member) {
      member.isChecked = event.isChecked;
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
    } else {
      this.dialogRef.close({ members: this.userIds, isEdit: true });
    }
  }

  markSelectedMembers(): void {
    this.userIds = [];
    if (this.data.controlname === 'UserIds') {
      this.memberList?.forEach((member: any) => {
        if (this.data.usersIds.includes(member.UserId)) {
          member.isChecked = true;
          this.userIds.push({ UserId: member.UserId, Name: member.Name });
        }
      });
    } else if (this.data.controlname === 'TaskOwner') {
      this.memberList.forEach((member) => {
        const matched = this.data.usersIds.find(
          (x: any) => x.UserId === member.UserId
        );
        if (matched) {
          member.isChecked = true;
        }
      });
      this.userIds = [...this.data.usersIds];
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { TaskService } from '../../../core/services/task.service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { AddUsersDialogComponent } from '../add-users-dialog/add-users-dialog.component';
import { DatePipe } from '@angular/common';
import { canComponentDeactivate } from '../../../core/guards/unsaved-alert.guard';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss',
  standalone: false
})
export class AddTaskDialogComponent implements OnInit, canComponentDeactivate {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  addTaskForm!: FormGroup;
  displayFileName: string = '';
  imageName: string = '';
  imageExt: string = '';

  selectedIndex: number = 0;
  isActive: boolean = true;
  tabDisable: boolean = false;
  taskDetails: any;
  viewLoading: boolean = false;

  taskOwners: any[] = [];
  taskOwnerCount: number = 0;
  userIds: any[] = [];
  assignedToCount: number = 0;

  leadData: any = {
    From: 1,
    To: -1,
    Text: '',
  };
  customerList: any;
  leadFilter: any;
  searchText = new FormControl('');
  current = new Date();

  readonly allowedExtensions = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'txt',
    'jpeg',
    'jpg',
    'png',
    'svg',
  ];

  constructor(
    public dialogRef: MatDialogRef<AddTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private taskService: TaskService,
    private toaster: ToastrService,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getLeadCustomerList();

    this.searchText.valueChanges.subscribe((text) => {
      this.leadFilter = this.filterLeadCustomers(text ?? '');
    });

    if (this.data.Action === 'Edit') {
      this.initializeEditState();
    }
  }

  onTabChange() {
    this.createForm();
  }

  createForm() {
    this.addTaskForm = this.fb.group({
      Id: [''],
      AssignedBy: [this.data.UserId],
      Description: ['', Validators.required],
      IsActive: [this.isActive],
      Image: [''],
      MultimediaData: [''],
      MultimediaExtension: [''],
      MultimediaFileName: [''],
      MultimediaType: [''],
      Priority: [''],
      TaskEndDateDisplay: ['', Validators.required],
      TaskEndDate: [''],
      TaskDisplayOwners: [''],
      TaskOwners: [''],
      Title: ['', [Validators.required, Validators.pattern(/^[A-Za-z ]+$/)]],
      UserDisplayIds: ['', Validators.required],
      UserIds: [''],
      LeadId: [''],
    });
  }

  initializeEditState() {
    const controls = this.addTaskForm.controls;
    this.selectedIndex = this.data.selectedIndex ?? 0;
    this.tabDisable = this.data.tabDisable ?? false;
    this.taskDetails = this.data.taskDetails;

    this.addTaskForm.patchValue(this.taskDetails);
    controls['Id'].setValue(this.taskDetails.TaskId);
    controls['TaskEndDateDisplay'].setValue(
      new Date(this.taskDetails.TaskEndDate).toISOString()
    );

    this.taskOwners = this.taskDetails.TaskOwnerIds || [];
    this.taskOwnerCount = this.taskDetails.TaskOwnerCount || 0;
    this.userIds = this.taskDetails.AssignedToUserIds || [];
    this.assignedToCount = this.taskDetails.AssignedToUserCount || 0;

    controls['TaskDisplayOwners'].setValue(
      this.getUserLabel(this.taskOwnerCount)
    );
    controls['UserDisplayIds'].setValue(
      this.getUserLabel(this.assignedToCount)
    );

    const fileType = this.taskService.getFileInfo(
      this.taskDetails.MultimediaName
    );
    if (this.allowedExtensions.includes(fileType.extension)) {
      this.displayFileName = fileType.name;
      this.imageName = fileType.name;
      this.imageExt = fileType.extension;
    }
  }

  triggerFileSelect(event?: Event): void {
    if (!event) {
      this.fileInput.nativeElement.click();
      return;
    }

    const file = (event.target as HTMLInputElement)?.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      this.toaster.error('File size is greater than 2MB');
      return;
    }

    this.displayFileName = file.name;
    this.imageName = file.name;
    this.imageExt = file.name.split('.').pop() ?? '';

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = btoa(e.target.result);
      this.addTaskForm.patchValue({
        Image: base64String,
        MultimediaData: base64String,
        MultimediaExtension: this.imageExt,
        MultimediaFileName: this.imageName,
        MultimediaType: file.type,
      });
    };
    reader.readAsBinaryString(file);
  }

  removeFile(): void {
    this.fileInput.nativeElement.value = '';
    this.displayFileName = '';
    this.imageName = '';
    this.imageExt = '';

    this.addTaskForm.patchValue({
      Image: '',
      MultimediaData: '',
      MultimediaExtension: '',
      MultimediaFileName: '',
      MultimediaType: '',
    });
  }

  getLeadCustomerList() {
    this.taskService
      .getCustomerList(this.leadData)
      .pipe(
        map((res) => {
          this.customerList = res.data.Leads;
          this.leadFilter = this.customerList;
        })
      )
      .subscribe();
  }

  filterLeadCustomers(value: string): any[] {
    return value
      ? this.customerList.filter((lead: any) => lead.LeadName.toLowerCase().includes(value.toLowerCase()))
      : this.customerList;
  }

  openMembers(controlName: string) {
    const isUser = controlName === 'UserIds';
    const displayControl = isUser ? 'UserDisplayIds' : 'TaskDisplayOwners';
    const controls = this.addTaskForm.controls;

    if (isUser) {
      controls[displayControl].clearValidators();
      controls[displayControl].updateValueAndValidity();
    }

    const dialogRef = this.dialog.open(AddUsersDialogComponent, {
      data: {
        usersIds: isUser ? this.userIds : this.taskOwners,
        controlname: controlName,
        Action: this.data.Action,
      },
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) return;

      const memberIds = res.members.map((m: any) => m.UserId);

      if (isUser) {
        this.userIds = memberIds;
        this.assignedToCount = this.userIds.length;

        if (this.data.Action === 'Edit') {
          this.taskService
            .addUsersExistingTask(this.data.UserId, this.userIds)
            .pipe(
              map((res) => {
                if (res.Status === 200)
                  this.toaster.success('User Updated Successfully');
              })
            )
            .subscribe();
        }
        controls[displayControl].setValue(
          this.getUserLabel(this.assignedToCount)
        );
      } else {
        this.taskOwners = res.members;
        this.taskOwnerCount = this.taskOwners.length;

        if (this.data.Action === 'Edit') {
          this.taskService
            .updateOwnerTask(this.data.UserId, this.taskOwners)
            .pipe(
              map((res) => {
                if (res.Status === 200) {
                  this.taskOwners = res.data.TaskOwnerIds;
                  this.toaster.success('User Updated Successfully');
                }
              })
            )
            .subscribe();
        }
        controls[displayControl].setValue(
          this.getUserLabel(this.taskOwnerCount)
        );
      }
    });
  }

  removeOwners(userType: string) {
    const isOwner = userType === 'Owner';
    const params = {
      usersData: isOwner ? this.taskOwners : this.userIds,
      taskId: this.data.UserId,
      Action: isOwner ? 'Owner' : 'User',
    };

    const dialogRef = this.dialog.open(AddUsersDialogComponent, {
      data: params,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) return;
      this.taskService.getTaskDetails(this.data.UserId).subscribe((response: any) => {
        if (isOwner) {
          this.taskOwners = response.data.TaskOwnerIds || [];
          this.taskOwnerCount = this.taskOwners.length;
          this.addTaskForm.controls['TaskDisplayOwners'].setValue(this.getUserLabel(this.taskOwnerCount));
        } else {
          this.userIds = response.data.AssignedToUserIds || [];
          this.assignedToCount = this.userIds.length;
          this.addTaskForm.controls['UserDisplayIds'].setValue(this.getUserLabel(this.assignedToCount));
        }
        this.toaster.success('User removed successfully');
      });
    });
  }

  onSubmit() {
    if (this.addTaskForm.invalid) {
      this.addTaskForm.markAllAsTouched(); 
      return;
    }  
    const controls = this.addTaskForm.controls;

    if (this.selectedIndex === 1) {
      controls['UserDisplayIds'].disable();
      if (this.data.Action === 'Edit') this.taskService.loadSubject.next(true);
    }

    if (this.addTaskForm.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());
      return;
    }

    if (this.selectedIndex === 0) {
      controls['UserDisplayIds'].setValidators(Validators.required);
      controls['UserDisplayIds'].updateValueAndValidity();
      controls['UserIds'].setValue(this.userIds);
    } else if (this.selectedIndex === 1) {
      this.userIds = [this.data.UserId];
      controls['UserIds'].setValue(this.userIds);
    }
    controls['TaskOwners'].setValue(this.taskOwners);
    controls['MultimediaExtension'].setValue(this.imageExt);
    controls['MultimediaFileName'].setValue(this.imageName);

    const multimediaType = ['jpeg', 'jpg', 'png', 'svg'].includes(
      this.imageExt.toLowerCase()
    )
      ? 'I'
      : this.imageExt
      ? 'D'
      : '';
    controls['MultimediaType'].setValue(multimediaType);

    controls['TaskEndDate'].setValue(
      this.datePipe.transform(
        controls['TaskEndDateDisplay'].value,
        'dd MMM yyyy hh:mm a'
      )
    );

    this.viewLoading = true;

    const taskRequest = this.data.Action === 'Edit'
      ? this.taskService.updateTask(this.addTaskForm.value)
      : this.taskService.addTask(this.addTaskForm.value);

    taskRequest.pipe(map((res) => {
      if (res.Status === 200) {
        this.dialogRef.close({
          res,
          selectTab: this.selectedIndex,
          isEdit: this.data.Action === 'Edit',
        });
        this.taskService.loadSubject.next(true);
      }
      this.viewLoading = false;
    })).subscribe();
  }

  private getUserLabel(count: number): string {
    return count === 0 ? '' : count === 1 ? '1 User' : `${count} Users`;
  }

  onClick() {
    this.dialogRef.close();
  }

  canDeactivate(): boolean{
    if(!this.addTaskForm){
      return confirm('You have unsaved changes. Do you really want to leave?');
    }
    return true;
  }
}

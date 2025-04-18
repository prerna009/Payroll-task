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
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AddUsersDialogComponent } from '../add-users-dialog/add-users-dialog.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-task-dialog',
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss',
})
export class AddTaskDialogComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  displayFileName: string = '';
  addTaskForm!: FormGroup;
  selectedIndex: number = 0;
  isActive: boolean = true;
  IntercomGroupIds: any[] = [];
  tabDisable: boolean = false;
  taskDetails: any;
  indexOfTab: number = 0;
  viewLoading: boolean = false;
  taskOwnerCount: any;
  taskOwners: any[] = [];
  assignedToCount: any;
  userIds: any;
  userDetails: any;
  imageName: string = '';
  imageExt: string = '';
  filteredLeadCustomers: any[] = [];
  leadData: any = {
    From: 1,
    To: -1,
    Text: '',
  };
  customerList: any;
  leadFilter: any;
  searchText = new FormControl('');
  current = new Date();

  private allowedExtensions = [
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
    this.getLeadCustomerList();
    this.createForm();

    this.searchText.valueChanges.subscribe((text) => {
      this.leadFilter = this.filterLeadCustomers(text ?? '');
    });
    
    if (this.data.Action === 'Edit') {
      this.selectedIndex = this.data.selectedIndex ?? 0;
      this.tabDisable = this.data.tabDisable ?? false;
      this.taskDetails = this.data.taskDetails;
      this.patchFormValue();
    }
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
      Title: ['', Validators.required],
      UserDisplayIds: ['', Validators.required],
      UserIds: [''],
      LeadId: [''],
    });
  }

  patchFormValue() {
    const controls = this.addTaskForm.controls;

    if (this.data.Action === 'Edit') {
      controls['Id'].enable();
      this.addTaskForm.patchValue(this.taskDetails);
      controls['Id'].setValue(this.taskDetails.TaskId);
      controls['TaskEndDateDisplay'].setValue(
        new Date(this.taskDetails.TaskEndDate).toISOString()
      );

      this.taskOwners = this.taskDetails.TaskOwnerIds;
      this.taskOwnerCount = this.taskDetails.TaskOwnerCount;
      this.userIds = this.taskDetails.AssignedToUserIds;
      this.userDetails = this.taskDetails.AssignedToUserIds;
      this.assignedToCount = this.taskDetails.AssignedToUserCount;

      if (this.taskOwnerCount) {
        controls['TaskDisplayOwners'].setValue(
          `${this.taskOwnerCount} ${this.taskOwnerCount > 1 ? 'Users' : 'User'}`
        );
      }

      if (this.assignedToCount) {
        controls['UserDisplayIds'].setValue(
          `${this.assignedToCount} ${
            this.assignedToCount > 1 ? 'Users' : 'User'
          }`
        );
      }

      const imageName = this.taskService.getName(
        this.taskDetails.MultimediaName
      );
      const fileExt = this.taskService.getExtension(
        this.taskDetails.MultimediaName
      );

      if (this.allowedExtensions.includes(fileExt)) {
        this.displayFileName = imageName;
      }
    }
  }

  triggerFileSelect(event?: Event): void {
    if (!event) {
      this.fileInput.nativeElement.click();
      return;
    }

    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      const file = input.files[0];
      if (file.size < 2000000) {
        this.displayFileName = file.name;
        this.imageName = file.name.split('\\').pop()?.split('/').pop() ?? '';
        const extMatch = this.imageName.split('.').pop();
        this.imageExt = extMatch ?? '';
        this.imageName = this.imageName.replace(`.${this.imageExt}`, '');

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
      } else {
        this.toaster.error('File size is greater than 5MB');
      }
    }
  }

  removeFile(): void {
    this.fileInput.nativeElement.value = '';
    this.displayFileName = '';

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
    if (!value) return this.customerList;
    const searchText = value.toLowerCase();
    return this.customerList.filter((lead: any) =>
      lead.LeadName.toLowerCase().includes(searchText)
    );
  }

  openMembers(controlName: any) {
    const controls = this.addTaskForm.controls;
    let controlname: any;
    let params;
    if (controlName === 'UserIds') {
      controls['UserDisplayIds'].clearValidators();
      controls['UserDisplayIds'].updateValueAndValidity();
      controlname = controls['UserDisplayIds'];
      params = {
        usersIds: this.userIds,
        controlname: 'UserIds',
        Action: this.data.Action,
      };
    } else {
      controlname = controls['TaskDisplayOwners'];
      params = {
        usersIds: this.taskOwners,
        controlname: 'TaskOwner',
        Action: this.data.Action,
      };
    }
    const dialogRef = this.dialog.open(AddUsersDialogComponent, {
      data: params,
      width: '400px',
    });


    dialogRef.afterClosed().subscribe((res) => {
      debugger
      if (!res) return;
      if (controlName === 'UserIds') {
        this.userIds = [];
        this.assignedToCount = 0;
        res.members.forEach((result: any) => {
          if (!this.userIds.includes(result.UserId)) {
            this.userIds.push(result.UserId);
            this.assignedToCount +=1;
          }
        });

        if (this.data.Action === 'Edit') {
          this.taskService
            .addUsersExistingTask(this.data.UserId, this.userIds)
            .pipe(
              map((res) => {
                if (res.Status === 200) {
                  this.toaster.success('User Updated Successfully');
                }
              })
            )
            .subscribe();
        }
      } else {
        this.taskOwners = [];
        this.taskOwnerCount = 0;
        res.members.forEach((result: any) => {
          if (!this.taskOwners.includes(result)) {
            this.taskOwnerCount += 1;
            this.taskOwners.push(result);
          }
        });

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
      }

      if (controlname === this.addTaskForm.controls['TaskDisplayOwners']) {
        controlname.setValue(
          this.taskOwners.length +
            (this.taskOwners.length <= 1 ? ' User' : ' Users')
        );
      }

      if (controlname === this.addTaskForm.controls['UserDisplayIds']) {
        controlname.setValue(
          this.userIds.length + (this.userIds.length <= 1 ? ' User' : ' Users')
        );
      }
    });
  }

  removeOwners(userType: string) {
    const isOwner = userType === 'Owner';
    const params = {
      usersData: isOwner ? this.taskOwners : this.userDetails,
      taskId: this.data.UserId,
      Action: isOwner ? 'Owner' : 'User',
    };

    const dialogRef = this.dialog.open(AddUsersDialogComponent, {
      data: params,
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) return;
      this.toaster.success('User Updated Successfully');
      this.ngOnInit();
    });
  }

  onSubmit() {
    const selectTab = this.selectedIndex;
    const controls = this.addTaskForm.controls;

    if (this.selectedIndex === 1) {
      controls['UserDisplayIds'].disable();
      if (this.data.Action === 'Edit') {
        this.taskService.load.next(true);
      }
    }

    if (this.addTaskForm.invalid) {
      Object.keys(controls).forEach((controlName) => {
        controls[controlName].markAsTouched();
      });
      return;
    }
    if (this.selectedIndex === 0) {
      controls['UserDisplayIds'].setValidators(Validators.required);
      controls['UserDisplayIds'].updateValueAndValidity();
      controls['UserIds'].setValue(this.userIds);
    }
    if (this.selectedIndex === 1) {
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

    const formattedDate = this.datePipe.transform(controls['TaskEndDateDisplay'].value,'dd MMM yyyy hh:mm a');
    controls['TaskEndDate'].setValue(formattedDate);
    this.viewLoading = true;
    const taskOperation =
      this.data.Action === 'Edit'
        ? this.taskService.updateTask(this.addTaskForm.value)
        : this.taskService.addTask(this.addTaskForm.value);

    taskOperation
      .pipe(
        map((res) => {
          if (res.Status === 200) {
            this.dialogRef.close({
              res,
              selectTab,
              isEdit: this.data.Action === 'Edit',
            });
            this.viewLoading = false;
          }
        })
      )
      .subscribe();
  }

  onClick() {
    this.dialogRef.close();
  }
}

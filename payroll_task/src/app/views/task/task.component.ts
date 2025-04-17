import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { AddTaskDialogComponent } from './add-task-dialog/add-task-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss',
})
export class TaskComponent implements OnInit {
  @ViewChild('searchInput', { static: true }) searchInput: any;
  username: string | null = null;
  currentDate: Date = new Date();
  tabIndex: number = 0;
  selectedTab: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.tabIndex = event.index;
  }

  addTask() {
    const params = {
      Action: 'Add',
      Button: 'Add',
      SelectedIndex: 0,
      UserId: this.authService.getUserId(),
    };

    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
      width: '600px',
      data: params,
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((res) => {
      if (!res) return;
      this.selectedTab = 0;
      this.toaster.success('Task Added Successfully');
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

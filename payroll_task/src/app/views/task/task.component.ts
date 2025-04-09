import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';

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

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.getUsername();
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.searchInput.nativeElement.value = '';
    this.tabIndex = event.index;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

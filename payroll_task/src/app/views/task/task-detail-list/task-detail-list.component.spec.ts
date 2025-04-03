import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskDetailListComponent } from './task-detail-list.component';

describe('TaskDetailListComponent', () => {
  let component: TaskDetailListComponent;
  let fixture: ComponentFixture<TaskDetailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskDetailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

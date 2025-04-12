import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewTaskCoverageComponent } from './view-task-coverage.component';

describe('ViewTaskCoverageComponent', () => {
  let component: ViewTaskCoverageComponent;
  let fixture: ComponentFixture<ViewTaskCoverageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewTaskCoverageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewTaskCoverageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

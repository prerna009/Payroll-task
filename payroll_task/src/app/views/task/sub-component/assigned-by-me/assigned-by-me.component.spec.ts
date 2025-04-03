import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedByMeComponent } from './assigned-by-me.component';

describe('AssignedByMeComponent', () => {
  let component: AssignedByMeComponent;
  let fixture: ComponentFixture<AssignedByMeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AssignedByMeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedByMeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

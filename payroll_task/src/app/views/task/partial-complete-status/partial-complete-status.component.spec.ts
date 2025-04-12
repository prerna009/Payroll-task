import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialCompleteStatusComponent } from './partial-complete-status.component';

describe('PartialCompleteStatusComponent', () => {
  let component: PartialCompleteStatusComponent;
  let fixture: ComponentFixture<PartialCompleteStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PartialCompleteStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartialCompleteStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

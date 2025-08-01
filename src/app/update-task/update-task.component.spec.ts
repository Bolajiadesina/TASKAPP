import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateTaskComponent } from './update-task.component';

describe('UpdateTaskComponent', () => {
  let component: UpdateTaskComponent;
  let fixture: ComponentFixture<UpdateTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should update', () => {
    expect(component).toBeTruthy();
  });
});

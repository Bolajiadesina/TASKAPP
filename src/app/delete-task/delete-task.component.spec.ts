import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DeleteTaskComponent } from './delete-task.component';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

describe('DeleteTaskComponent', () => {
  let component: DeleteTaskComponent;
  let fixture: ComponentFixture<DeleteTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteTaskComponent, ReactiveFormsModule],
      providers: [
        { provide: ActivatedRoute, 
          useValue: { 
            snapshot: { 
              paramMap: {
                get:  (key:string)=> null
              } 
            } 
          } 
        }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteTaskComponent);
    component = fixture.componentInstance;
    component.taskForm = new FormGroup({
    taskId: new FormControl('')
    });


    fixture.detectChanges();
  });

  it('should delete', () => {
    expect(component).toBeTruthy();
  });

});
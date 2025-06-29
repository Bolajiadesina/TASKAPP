import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CreateTaskComponent } from './create-task.component';
import { ActivatedRoute } from '@angular/router';

describe('CreateTaskComponent', () => {
  let component: CreateTaskComponent;
  let fixture: ComponentFixture<CreateTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTaskComponent],
      providers: [
        { 
          provide: ActivatedRoute, 
          useValue: {
          queryParams: of({}) // <-- This makes .subscribe work!
        }
      }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

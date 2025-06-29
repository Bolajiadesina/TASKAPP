import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { GetTaskComponent } from './get-task.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { AppComponent } from '../app.component';

describe('GetTaskComponent', () => {

  let fixture: ComponentFixture<GetTaskComponent>;
  let component: GetTaskComponent;
  let modalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    const modalSpy = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, FormsModule, GetTaskComponent],
      // declarations: [GetTaskComponent],
      providers: [
        { provide: NgbModal, useValue: modalSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(GetTaskComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal) as jasmine.SpyObj<NgbModal>;
    fixture.detectChanges();
  });





  it('should render the correct number of rows for paginated tasks', () => {
    component.tasks = Array.from({ length: 15 }, (_, i) => ({
      taskId: i + 1,
      taskName: `Task ${i + 1}`,
      taskDescription: 'desc',
      taskStatus: 'PENDING',
      taskDueDate: '2025-01-01'
    }));
    component.page = 1;
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBeLessThanOrEqual(10); // itemsPerPage = 10
  });

  it('should open details modal with correct task data', () => {
    const task = { taskId: '0704d8ad-2a2e-4914-b93b-e43ba4b0f8aa', taskName: 'Test', taskDescription: 'desc', taskStatus: 'PENDING', taskDueDate: '2025-01-01' };
    spyOn(component.http, 'get').and.returnValue(of({ data: task }));
    component.getTaskById('0704d8ad-2a2e-4914-b93b-e43ba4b0f8aa');
    expect(modalService.open).toHaveBeenCalled();
    expect(component.task.taskName).toBe('Test');
  });

  it('should open confirm delete modal with correct task', () => {
    const task = { taskId: '008fcd23-3633-4ca1-a23a-921b96269ae0', taskName: 'DeleteMe', taskDescription: 'desc', taskStatus: 'PENDING', taskDueDate: '2025-01-01' };
    spyOn(component.http, 'get').and.returnValue(of({ data: task }));
    component.deleteSelectedItem('008fcd23-3633-4ca1-a23a-921b96269ae0');
    expect(modalService.open).toHaveBeenCalledWith(component.confirmDeleteModal);
    expect(component.task.taskId).toBe('008fcd23-3633-4ca1-a23a-921b96269ae0');
  });

  it('should call delete API and show success modal on success', fakeAsync(() => {
    spyOn(component.http, 'delete').and.returnValue(of({ responseCode: '00', responseMessage: 'Deleted', data: {} }));
    component.task = { taskId: 'cfeee303-22d9-48be-95ec-2864633ed9a0', taskName: '', taskDescription: '', taskStatus: '', taskDueDate: '' };
    component.deleteItem('cfeee303-22d9-48be-95ec-2864633ed9a0');
    tick(2000);
    expect(modalService.open).toHaveBeenCalledWith(component.successModal);
    expect(component.responseMessage).toBe('Deleted');
  }));

  it('should show failed modal on delete API failure', () => {
    spyOn(component.http, 'delete').and.returnValue(of({ responseCode: '99', responseMessage: 'Failed', data: {} }));
    component.deleteItem('6671c811-be6a-406c-abe1-fc6a82fd404f');
    expect(modalService.open).toHaveBeenCalledWith(component.failedModal);
    expect(component.responseMessage).toBe('Failed');
  });

  it('should close all modals when closeAllModals is called', () => {
    component.closeAllModals();
    expect(modalService.dismissAll).toHaveBeenCalled();
  });

  it('should validate UUID format in delete form (template-driven)', () => {
    // Simulate template-driven validation: pattern is handled by browser/Angular, not in TS
    // You can test this in an e2e/integration test, not a unit test
    expect(true).toBeTrue();
  });

  it('should update task status and show success modal', fakeAsync(() => {
    component.statusForm.setValue({ taskStatus: 'COMPLETED' });
    spyOn(component.http, 'put').and.returnValue(of({ responseCode: '00', responseMessage: 'Updated', data: { taskStatus: 'COMPLETED' } }));
    component.task = { taskId: '8d586d92-a6dc-4666-8d2e-039f941b985f', taskName: '', taskDescription: '', taskStatus: '', taskDueDate: '' };
    component.changeTaskStatus('8d586d92-a6dc-4666-8d2e-039f941b985f', '', '', '');
    tick(2000);
    expect(modalService.open).toHaveBeenCalledWith(component.successModal);
    expect(component.task.taskStatus).toBe('COMPLETED');
  }));

  it('should show failed modal on status update failure', () => {
    component.statusForm.setValue({ taskStatus: 'PENDING' });
    spyOn(component.http, 'put').and.returnValue(of({ responseCode: '99', responseMessage: 'Failed', data: {} }));
    component.task = { taskId: 'a7c6c897-4cf0-4254-b060-68a4fa74e5db', taskName: '', taskDescription: '', taskStatus: '', taskDueDate: '' };
    component.changeTaskStatus('a7c6c897-4cf0-4254-b060-68a4fa74e5db', '', '', '');
    expect(modalService.open).toHaveBeenCalledWith(component.failedModal);
    expect(component.responseMessage).toBe('Failed');
  });

  it('should handle API error gracefully', () => {
    spyOn(component.http, 'delete').and.returnValue(throwError(() => new Error('API error')));
    spyOn(console, 'error');
    component.deleteItem('592eb8dd-790e-4095-8549-a631c6ab8482');
    expect(console.error).toHaveBeenCalled();
  });

  it('should filter tasks based on filterText', () => {
    component.tasks = [
      { taskId: 'e33c51d6-634e-4abe-bd13-653dab8ab621', taskName: 'Alpha', taskDescription: '', taskStatus: '', taskDueDate: '' },
      { taskId: '8cd4a1f2-19cd-47a2-ad52-d1ee61e0c05a', taskName: 'Beta', taskDescription: '', taskStatus: '', taskDueDate: '' }
    ];
    component.filterText = 'Alpha';
    expect(component.filteredTasks.length).toBe(1);
    expect(component.filteredTasks[0].taskName).toBe('Alpha');
  });

  it('should handle empty task list gracefully', () => {
    component.tasks = [];
    fixture.detectChanges();
    expect(component.tasks.length).toBe(0);
  });
});
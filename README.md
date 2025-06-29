# TaskApp

TaskApp
TaskApp is a simple Angular application for managing tasks. It allows users to create, view, update, and delete tasks, with features such as form validation, modal dialogs, filtering, and pagination. The project demonstrates best practices in Angular development, including the use of standalone components, reactive and template-driven forms, and unit testing.

Features
Create Task: Add new tasks with validation for required fields and due date.
View Tasks: Display a paginated and filterable list of all tasks.
Update Task: Edit task details and status using modals and forms.
Delete Task: Remove tasks with confirmation dialogs.
Form Validation: Both template-driven and reactive forms, including UUID validation for task IDs.
Modals: User-friendly confirmation and feedback using ng-bootstrap modals.
Pagination: Easy navigation through large task lists using ngx-pagination.
Filtering: Real-time filtering of tasks by name, description, or status.
Unit Testing: Comprehensive test coverage for components and services.
## Getting Started
### Prerequisites
Node.js (v16+ recommended)
Angular CLI (npm install -g @angular/cli)

Installation
Clone the repository:
```git clone``` https://github.com/yourusername/TaskApp.git
```cd TaskApp```

Install dependencies:
```npm install```

Install required libraries:
```npm install ngx-pagination @ng-bootstrap/ng-bootstrap```

Running the Application
```ng serve```

Open your browser at http://localhost:4200.

Running Unit Tests
```ng test```

This will run all ```.spec.ts``` files using Karma and Jasmine.

### Project Structure
src/app/
  ├── create-task/         # CreateTaskComponent (standalone)
  ├── get-task/            # GetTaskComponent (standalone, task list, filter, pagination)
  ├── update-task/         # UpdateTaskComponent (standalone, update form)
  ├── delete-task/         # DeleteTaskComponent (standalone, delete confirmation)
  ├── app.component.*      # Main app shell
  └── ...                  # Other shared modules and assets

### API
The app expects a backend API with endpoints like:

- GET ```/api/tasks``` - List all tasks
- GET ```/api/tasks/:id``` - Get a task by ID
- POST ```/api/tasks/create``` - Create a new task
- PUT ```/api/tasks``` - Update a task (with task object in body)
- DELETE ```/api/tasks/:id``` - Delete a task by ID
You can configure the API base URL in the service or environment files.

### Customization
- Styling: Modify CSS in each component or in app.component.css.
- Validation: Adjust or add validators in the form definitions.
- Modals: Customize modal templates in each component’s HTML.
Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.



### Acknowledgements
Angular
ng-bootstrap
ngx-pagination
Enjoy using TaskApp! If you have any questions or suggestions, feel free to open an issue or contact the maintainer.

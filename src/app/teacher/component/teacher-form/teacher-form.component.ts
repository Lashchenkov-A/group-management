import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

export interface TeacherFormModel {
  firstName: string;
  secondName: string;
  lastName: string;
  jobRole: string;
}

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrl: './teacher-form.component.css',
})
export class TeacherFormComponent {
  @Input() onSubmit!: (values: TeacherFormModel) => void;
  @Input() icon: string = '';
  @Input() teacher: TeacherFormModel = {
    firstName: '',
    secondName: '',
    lastName: '',
    jobRole: '',
  };

  constructor(public router: Router) {}

  ngOnInit(): void {}

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.onSubmit(this.teacher);
  }
}

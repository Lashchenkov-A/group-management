import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

export interface SubjectFormModel {
  name: string;
}

@Component({
  selector: 'app-subject-form',
  templateUrl: './subject-form.component.html',
  styleUrls: ['./subject-form.component.css'],
})
export class SubjectFormComponent implements OnInit {
  @Input() onSubmit!: (values: SubjectFormModel) => void;
  @Input() icon: string = '';
  @Input() subject: SubjectFormModel = { name: '' };

  constructor(public router: Router) {}

  ngOnInit(): void {}

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.onSubmit(this.subject);
  }
}

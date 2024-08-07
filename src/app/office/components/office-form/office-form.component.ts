import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

export interface OfficeFormModel {
  corpusNumber: number;
  classroomNumber: number;
}

@Component({
  selector: 'app-office-form',
  templateUrl: './office-form.component.html',
  styleUrl: './office-form.component.css',
})
export class OfficeFormComponent {
  @Input() onSubmit!: (values: OfficeFormModel) => void;
  @Input() icon: string = '';
  @Input() office: OfficeFormModel = { corpusNumber: 0, classroomNumber: 0 };

  constructor(public router: Router) {}

  ngOnInit(): void {}

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.onSubmit(this.office);
  }
}

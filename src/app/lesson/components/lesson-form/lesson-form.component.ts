import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Router } from '@angular/router';

export interface LessonFormModel {
  year: string;
}

@Component({
  selector: 'app-lesson-form',
  templateUrl: './lesson-form.component.html',
  styleUrls: ['./lesson-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LessonFormComponent implements OnInit {
  items: any;
  value: any;
  submit() {
    throw new Error('Method not implemented.');
  }
  @Input() onSubmit!: (values: LessonFormModel) => void;
  @Input() icon: string = '';
  @Input() lesson: LessonFormModel = { year: '' };
  hasValue: any;

  constructor(public router: Router) {}

  ngOnInit(): void {}
}

import { Component, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

export interface GroupFormModel {
  name: string;
}

@Component({
  selector: 'app-group-form',
  templateUrl: './group-form.component.html',
  styleUrls: ['./group-form.component.css'],
})
export class GroupFormComponent implements OnInit {
  @Input() onSubmit!: (values: GroupFormModel) => void;
  @Input() icon: string = '/assets/img/addList.png';
  @Input() group: GroupFormModel = { name: '' };

  constructor(public router: Router) {}

  ngOnInit(): void {}

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.onSubmit(this.group);
  }
}

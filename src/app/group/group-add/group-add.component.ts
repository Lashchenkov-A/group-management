import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../../../core/group/group.service';
import { GroupFormModel } from '../components/group-form/group-form.component';
import { UIService } from '../../../core/common/ui.service';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupAddComponent implements OnInit {
  group: GroupFormModel = { name: '' };

  constructor(
    private groupService: GroupService,
    public router: Router,
    private readonly ui: UIService
  ) {}

  ngOnInit(): void {}

  addGroup(group: GroupFormModel): void {
    if (group.name.trim() !== '') {
      this.groupService.addGroup(group).subscribe(
        () => {
          this.ui.showAlert('Группа успешно добавлена!');
          this.router.navigate(['/groups']);
        },
        (error) => {
          console.error('Ошибка при добавлении группы', error);
          this.showErrorMessage();
        }
      );
    } else {
      console.log('Имя группы пусто');
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении группы.', true);
  }
}

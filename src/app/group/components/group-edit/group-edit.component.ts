import { Component, Inject, OnInit } from '@angular/core';
import { GroupService } from '../../../../core/group/group.service';
import { Group } from '../../../../core/group/group.model';
import { GroupFormModel } from '../group-form/group-form.component';
import { TuiDialogContext } from '@taiga-ui/core';
import { UIService } from '../../../../core/common/services/ui.service';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css'],
})
export class GroupEditComponent implements OnInit {
  group: Group | null = null;

  constructor(
    private groupService: GroupService,
    private readonly ui: UIService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, { groupId: number }>
  ) {}

  ngOnInit(): void {
    const groupId = this.context.data.groupId;
    this.fetchGroupDetails(groupId);
  }

  fetchGroupDetails(groupId: number): void {
    this.groupService.getGroup(groupId).subscribe(
      (group) => {
        this.group = group;
      },
      (error) => {
        console.error('Ошибка при получении деталей группы', error);
      }
    );
  }

  updateGroup(formValues: GroupFormModel): void {
    if (this.group?.id && formValues.name.trim()) {
      this.groupService.updateGroup(this.group.id, formValues).subscribe(
        () => {
          this.ui.showAlert('Группа успешно изменена!');
          this.context.completeWith();
        },
        (error) => {
          this.showErrorMessage();
          console.error('Ошибка при обновлении группы', error);
        }
      );
    } else {
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Ошибка при получении деталей группы.', true);
  }
}

import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { GroupService } from '../../../../core/group/group.service';
import { GroupFormModel } from '../group-form/group-form.component';
import { UIService } from '../../../../core/common/services/ui.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';

@Component({
  selector: 'app-group-add',
  templateUrl: './group-add.component.html',
  styleUrls: ['./group-add.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupAddComponent implements OnInit {
  group: GroupFormModel = { name: '' };

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean>,
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
          this.context.completeWith(true);
        },
        (error) => {
          console.error('Ошибка при добавлении группы', error);
          this.showErrorMessage();
        }
      );
    } else {
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Произошла ошибка при добавлении группы.', true);
  }
}

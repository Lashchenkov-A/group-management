import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupService } from '../../../core/group/group.service';
import { Group } from '../../../core/group/group.model';
import { GroupFormModel } from '../components/group-form/group-form.component';
import { TuiDialogService } from '@taiga-ui/core';
import { UIService } from '../../../core/common/ui.service';

@Component({
  selector: 'app-group-edit',
  templateUrl: './group-edit.component.html',
  styleUrls: ['./group-edit.component.css'],
})
export class GroupEditComponent implements OnInit {
  group: Group | null = null;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private groupService: GroupService,
    private readonly ui: UIService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const groupId = +params.get('id')!;
      if (groupId) {
        this.fetchGroupDetails(groupId);
      }
    });
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
          this.router.navigate(['/groups']);
        },
        (error) => {
          this.showErrorMessage();
          console.error('Ошибка при обновлении группы', error);
        }
      );
    } else {
      console.log('Имя группы пусто');
      this.showErrorMessage();
    }
  }

  showErrorMessage(): void {
    this.ui.showAlert('Ошибка при получении деталей группы.', true);
  }
}

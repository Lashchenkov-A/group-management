import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiDialogService, TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@taiga-ui/polymorpheus';
import { Subject } from 'rxjs';
import { Group } from '../../../../core/group/group.model';
import { Paged } from '../../../../core/common/models/pages.model';
import { UIService } from '../../../../core/common/services/ui.service';
import { GroupService } from '../../../../core/group/group.service';
import { LessonService } from '../../../../core/lesson/lesson.service';

interface DialogData {
  groupIdToDelete: number;
}
@Component({
  selector: 'app-group-replace',
  templateUrl: './group-replace.component.html',
  styleUrls: ['./group-replace.component.scss'],
})
export class GroupReplaceComponent implements OnInit {
  groups: Group[] = [];
  groupForm: FormGroup;
  private readonly destroy$ = new Subject<void>();
  pagingInfo: Paged<void> | null = null;
  page = 1;
  size = 20;

  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, DialogData>,
    private groupService: GroupService,
    private lessonService: LessonService,
    private readonly ui: UIService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService
  ) {
    this.groupForm = new FormGroup({
      groupId: new FormControl(null),
    });
  }

  ngOnInit(): void {
    this.lessonService.getLookupData('group').subscribe((data) => {
      const groupIdToDelete = this.context.data?.groupIdToDelete;
      if (groupIdToDelete !== undefined) {
        this.groups = this.parseGroups(data).filter(
          (group) => group.id !== groupIdToDelete
        );
      }
    });
  }

  confirmReplacement() {
    const selectedGroup = this.groupForm.get('groupId')?.value;
    if (selectedGroup) {
      const selectedGroupId =
        typeof selectedGroup === 'object' ? selectedGroup.id : selectedGroup;
      this.context.completeWith(selectedGroupId);
    }
  }

  parseGroups(data: any[]): Group[] {
    return data.map((item) => ({
      id: item.id,
      name: item.name,
    }));
  }

  confirmDeleteGroupWithLessons(event: Event): void {
    event.preventDefault();

    const selectedGroupId = this.groupForm.get('groupId')?.value;

    this.openConfirmationDialog().subscribe((isConfirmed: boolean) => {
      if (isConfirmed) {
        if (!selectedGroupId) {
          const groupIdToDelete = this.context.data?.groupIdToDelete;
          if (groupIdToDelete !== undefined) {
            this.deleteGroupAndLessonsById(groupIdToDelete);
          }
        } else {
          const selectedGroup = this.groups.find(
            (group) => group.id === selectedGroupId
          );

          if (selectedGroup) {
            this.deleteGroupAndLessons(selectedGroup);
          } else {
            this.ui.showAlert('Выбранная группа не найдена.', true);
          }
        }
      }
    });
  }

  deleteGroupAndLessonsById(groupId: number): void {
    this.groupService.deleteGroup(groupId).subscribe({
      next: () => {
        this.ui.showAlert('Группа и связанные с ней данные успешно удалены.');
        this.fetchGroups(this.page, this.size);
        this.context.completeWith();
        this.fetchGroups(this.page, this.size);
      },
      error: (error) => {
        this.ui.showAlert(`Ошибка при удалении группы: ${error}`, true);
        console.error(error);
      },
    });
  }

  deleteGroupAndLessons(group: Group): void {
    const groupId = group.id;

    this.groupService.deleteGroup(groupId).subscribe({
      next: () => {
        this.ui.showAlert(
          `Группа ${group.name} и связанные с ней данные успешно удалены.`
        );
        this.fetchGroups(this.page, this.size);
      },
      error: (error) => {
        this.ui.showAlert(`Ошибка при удалении группы: ${error}`, true);
        console.error(error);
      },
    });

    this.context.completeWith();
  }

  openConfirmationDialog() {
    return this.ui.confirmModal(
      'Подтверждение удаления',
      'Вы действительно хотите удалить группу и все связанные пары?'
    );
  }

  fetchGroups(page: number, pageSize: number): void {
    this.groupService.getGroups(this.page, this.size).subscribe(
      (res) => {
        this.groups = res.data;
        this.pagingInfo = { ...res, data: [] };
      },
      (error) => console.error('Ошибка при запросе:', error)
    );
  }

  groupStringify = (item: Group) => item.name;
}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupListComponent } from './group/group-list/group-list.component';
import { LessonListComponent } from './lesson/lesson-list/lesson-list.component';
import { SubjectListComponent } from './subject/subject-list/subject-list.component';
import { OfficeListComponent } from './office/office-list/office-list.component';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/lessons', pathMatch: 'full' },
  {
    path: 'groups',
    component: GroupListComponent,
    data: { title: 'Редактирование групп' },
  },
  {
    path: 'lessons',
    component: LessonListComponent,
    data: { title: 'Редактирование пар' },
  },
  {
    path: 'subjects',
    component: SubjectListComponent,
    data: { title: 'Редактирование предметов' },
  },
  {
    path: 'offices',
    component: OfficeListComponent,
    data: { title: 'Редактирование кабинетов' },
  },
  {
    path: 'teachers',
    component: TeacherListComponent,
    data: { title: 'Редактирование преподавателей' },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

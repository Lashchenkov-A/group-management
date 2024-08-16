import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupListComponent } from './group/group-list/group-list.component';
import { LessonListComponent } from './lesson/lesson-list/lesson-list.component';
import { SubjectListComponent } from './subject/subject-list/subject-list.component';
import { OfficeListComponent } from './office/office-list/office-list.component';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { UserScheduleComponent } from './schedule/user-schedule/user-schedule.component';
import { GroupScheduleComponent } from './schedule/group-schedule/group-schedule/group-schedule.component';
import { AdminGuard } from './components/auth/admin.guard';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home',
    component: UserScheduleComponent,
    data: { title: 'Расписание занятий студентов' },
  },
  {
    path: 'schedule',
    component: GroupScheduleComponent,
    data: { title: 'Расписание занятий' },
  },
  {
    path: 'groups',
    component: GroupListComponent,
    data: { title: 'Редактирование групп' },
    canActivate: [AdminGuard],
  },
  {
    path: 'lessons',
    component: LessonListComponent,
    data: { title: 'Редактирование пар' },
    canActivate: [AdminGuard],
  },
  {
    path: 'subjects',
    component: SubjectListComponent,
    data: { title: 'Редактирование предметов' },
    canActivate: [AdminGuard],
  },
  {
    path: 'offices',
    component: OfficeListComponent,
    data: { title: 'Редактирование кабинетов' },
    canActivate: [AdminGuard],
  },
  {
    path: 'teachers',
    component: TeacherListComponent,
    data: { title: 'Редактирование преподавателей' },
    canActivate: [AdminGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

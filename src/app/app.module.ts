import { TuiTabBar } from '@taiga-ui/addon-mobile';
import {
  TuiTextfieldControllerModule,
  TUI_SANITIZER,
  TuiInputModule,
  TuiInputPasswordModule,
  TuiSelectModule,
} from '@taiga-ui/legacy';
import { NgDompurifySanitizer } from '@taiga-ui/dompurify';
import {
  TuiRoot,
  TuiAlert,
  TuiFormatNumberPipe,
  TuiDataList,
  TuiIcon,
  TuiDialog,
  TuiButton,
  TuiError,
} from '@taiga-ui/core';
import { TuiTablePagination, TuiTable } from '@taiga-ui/addon-table';
import {
  TuiDataListWrapper,
  TuiFiles,
  TuiCheckbox,
  TuiFieldErrorPipe,
  TUI_VALIDATION_ERRORS,
} from '@taiga-ui/kit';
import { TuiAutoFocus } from '@taiga-ui/cdk';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GroupFormComponent } from './group/components/group-form/group-form.component';
import { GroupAddComponent } from './group/components/group-add/group-add.component';
import { GroupEditComponent } from './group/components/group-edit/group-edit.component';
import { GroupListComponent } from './group/group-list/group-list.component';
import { LessonFormComponent } from './lesson/components/lesson-form/lesson-form.component';
import { LessonListComponent } from './lesson/lesson-list/lesson-list.component';
import { LessonAddComponent } from './lesson/components/lesson-add/lesson-add.component';
import { LessonEditComponent } from './lesson/components/lesson-edit/lesson-edit.component';
import { SubjectListComponent } from './subject/subject-list/subject-list.component';
import { SubjectAddComponent } from './subject/components/subject-add/subject-add.component';
import { SubjectEditComponent } from './subject/components/subject-edit/subject-edit.component';
import { SubjectFormComponent } from './subject/components/subject-form/subject-form.component';
import { MainNavigation } from './components/navigation/navigation.component';
import { OfficeListComponent } from './office/office-list/office-list.component';
import { OfficeAddComponent } from './office/components/office-add/office-add.component';
import { OfficeEditComponent } from './office/components/office-edit/office-edit.component';
import { OfficeFormComponent } from './office/components/office-form/office-form.component';
import { TeacherListComponent } from './teacher/teacher-list/teacher-list.component';
import { TeacherAddComponent } from './teacher/component/teacher-add/teacher-add.component';
import { TeacherEditComponent } from './teacher/component/teacher-edit/teacher-edit.component';
import { TeacherFormComponent } from './teacher/component/teacher-form/teacher-form.component';
import { UserScheduleComponent } from './schedule/user-schedule/user-schedule.component';
import { AuthInterceptor } from '../core/auth/auth.interceptor';
import { AuthModalComponent } from './components/auth/auth-modal/auth-modal.component';
import { AuthService } from '../core/auth/auth.service';
import {
  LucideAngularModule,
  LogIn,
  LogOut,
  Pencil,
  Trash2,
  BookOpenCheck,
  House,
  PenTool,
  UserRound,
  UsersRound,
  CircleChevronLeft,
  CircleChevronRight,
} from 'lucide-angular';
import { of } from 'rxjs';
import { RegisterModalComponent } from './components/auth/register-modal/register-modal.component';
import { GroupReplaceComponent } from './group/components/group-replace/group-replace.component';
import { GroupScheduleComponent } from './schedule/group-schedule/group-schedule.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupListComponent,
    GroupFormComponent,
    GroupEditComponent,
    GroupAddComponent,
    LessonFormComponent,
    LessonListComponent,
    LessonAddComponent,
    LessonEditComponent,
    SubjectListComponent,
    SubjectAddComponent,
    SubjectEditComponent,
    SubjectFormComponent,
    MainNavigation,
    OfficeListComponent,
    OfficeAddComponent,
    OfficeEditComponent,
    OfficeFormComponent,
    TeacherListComponent,
    TeacherAddComponent,
    TeacherEditComponent,
    TeacherFormComponent,
    UserScheduleComponent,
    AuthModalComponent,
    RegisterModalComponent,
    GroupReplaceComponent,
    GroupScheduleComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRoot,
    TuiAlert,
    TuiDialog,
    ...TuiTable,
    TuiFormatNumberPipe,
    TuiInputModule,
    TuiButton,
    TuiTablePagination,
    ReactiveFormsModule,
    TuiIcon,
    TuiSelectModule,
    TuiAutoFocus,
    ...TuiDataListWrapper,
    ...TuiDataList,
    TuiTextfieldControllerModule,
    ...TuiTabBar,
    TuiInputPasswordModule,
    LucideAngularModule.pick({
      LogIn,
      LogOut,
      Pencil,
      Trash2,
      BookOpenCheck,
      House,
      UserRound,
      UsersRound,
      PenTool,
      CircleChevronLeft,
      CircleChevronRight,
    }),
    ...TuiFiles,
    TuiCheckbox,
    TuiFieldErrorPipe,
    AsyncPipe,
    TuiError,
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer },
    AuthService,
    {
      provide: TUI_VALIDATION_ERRORS,
      useValue: {
        maxlength: ({ requiredLength }: { requiredLength: string }) =>
          `Максимальная длина — ${requiredLength}`,
        minlength: ({ requiredLength }: { requiredLength: string }) =>
          of(`Минимальная длина — ${requiredLength}`),
        required: () => `Это поле обязательно для заполнения`,
      },
    },
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

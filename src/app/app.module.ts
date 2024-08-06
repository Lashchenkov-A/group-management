import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
  TuiSvgModule,
  TuiButtonModule,
  TuiFormatNumberPipeModule,
  TuiDataListModule,
  TuiTextfieldControllerModule,
} from '@taiga-ui/core';
import {
  TuiTableModule,
  TuiTablePaginationModule,
} from '@taiga-ui/addon-table';
import {
  TuiInputModule,
  TuiSelectModule,
  TuiDataListWrapperModule,
} from '@taiga-ui/kit';
import { TuiAutoFocusModule } from '@taiga-ui/cdk';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderComponent } from './components/loader/loader.component';
import { GroupFormComponent } from './group/components/group-form/group-form.component';
import { GroupAddComponent } from './group/components/group-add/group-add.component';
import { GroupEditComponent } from './group/components/group-edit/group-edit.component';
import { GroupListComponent } from './group/group-list/group-list.component';
import { LessonEditComponent } from './lesson/components/lesson-edit/lesson-edit.component';
import { LessonFormComponent } from './lesson/components/lesson-form/lesson-form.component';
import { LessonListComponent } from './lesson/lesson-list/lesson-list.component';
import { AddLessonDialogComponent } from './lesson/components/lesson-add/lesson-add.component';

@NgModule({
  declarations: [
    AppComponent,
    GroupListComponent,
    GroupFormComponent,
    GroupEditComponent,
    GroupAddComponent,
    LoaderComponent,
    LessonEditComponent,
    LessonFormComponent,
    LessonListComponent,
    AddLessonDialogComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TuiRootModule,
    TuiAlertModule,
    TuiDialogModule,
    TuiTableModule,
    TuiFormatNumberPipeModule,
    TuiInputModule,
    TuiButtonModule,
    TuiTablePaginationModule,
    ReactiveFormsModule,
    TuiSvgModule,
    TuiSelectModule,
    TuiAutoFocusModule,
    TuiDataListWrapperModule,
    TuiDataListModule,
    TuiTextfieldControllerModule,
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}

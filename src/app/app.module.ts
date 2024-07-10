import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import {
  TuiRootModule,
  TuiDialogModule,
  TuiAlertModule,
  TUI_SANITIZER,
} from '@taiga-ui/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoaderComponent } from './components/loader/loader.component';
import { GroupFormComponent } from './group/components/group-form/group-form.component';
import { GroupAddComponent } from './group/components/group-add/group-add.component';
import { GroupEditComponent } from './group/components/group-edit/group-edit.component';
import { GroupListComponent } from './group/group-list/group-list.component';
import { TuiTableModule } from '@taiga-ui/addon-table';
import { TuiFormatNumberPipeModule } from '@taiga-ui/core';
import { TuiInputModule } from '@taiga-ui/kit';
import { TuiButtonModule } from '@taiga-ui/core';
import { TuiTablePaginationModule } from '@taiga-ui/addon-table';

@NgModule({
  declarations: [
    AppComponent,
    GroupListComponent,
    GroupFormComponent,
    GroupEditComponent,
    GroupAddComponent,
    LoaderComponent,
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
  ],
  bootstrap: [AppComponent],
  providers: [{ provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }],
})
export class AppModule {}

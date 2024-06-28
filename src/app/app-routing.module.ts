import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupListComponent } from './group/group-list/group-list.component';
import { GroupEditComponent } from './group/group-edit/group-edit.component';
import { GroupAddComponent } from './group/group-add/group-add.component';

const routes: Routes = [
  { path: '', redirectTo: '/groups', pathMatch: 'full' },
  { path: 'groups', component: GroupListComponent },
  { path: 'group/add', component: GroupAddComponent },
  { path: 'group/:id', component: GroupEditComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

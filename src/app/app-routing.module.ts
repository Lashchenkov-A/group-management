import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GroupListComponent } from './group/group-list/group-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/groups', pathMatch: 'full' },
  { path: 'groups', component: GroupListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

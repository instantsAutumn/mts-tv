import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChannelsComponent } from './components/channels/channels.component';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  { path: 'channels', component: ChannelsComponent },
  { path: 'first', component: ErrorComponent },
  { path: 'second', component: ErrorComponent },
  { path: '',   redirectTo: '/channels', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { VideoMainComponent } from './components/video-main/video-main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  {path : '' , component : VideoMainComponent},
  {path : 'video' , component : VideoMainComponent},
  {path : '**' , component : ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }

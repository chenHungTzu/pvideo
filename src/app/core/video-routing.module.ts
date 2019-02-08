import { HomeComponent } from './components/home/home.component';
import { VideoMainComponent } from './components/video-main/video-main.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './components/error/error.component';

const routes: Routes = [
  {path : '' , redirectTo : 'home', pathMatch: 'full' },
  {path : 'video' , component : VideoMainComponent},
  {path : 'home' , loadChildren : "../core/components/home/home.module#HomeModule"},
  {path : '**' , component : ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoRoutingModule { }

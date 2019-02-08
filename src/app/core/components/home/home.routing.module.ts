
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { FriendPostComponent } from '../friend-post/friend-post.component';
import { PictureGridComponent } from '../picture-grid/picture-grid.component';

const routes: Routes = [
  {path : '' , component : HomeComponent , children:[
    {path : '' , component : FriendPostComponent},
    {path : 'friend' , component : FriendPostComponent}, 
    {path : 'grid' , component : PictureGridComponent}, 

  ] },
 // {path : 'home-content' , loadChildren : '../home-content/home-content.module#HomeContentModule'},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }

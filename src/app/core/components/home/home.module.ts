import { FriendPostComponent } from '../friend-post/friend-post.component';
import { PictureGridComponent } from '../picture-grid/picture-grid.component';
import { HomeRoutingModule } from './home.routing.module';
import { HomeComponent } from './home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ 
   HomeComponent,
   PictureGridComponent,
   FriendPostComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    
  ],
  exports: [
    HomeComponent,
    PictureGridComponent,
    FriendPostComponent
  ]
})
export class HomeModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { VideoMainComponent } from './components/video-main/video-main.component';
import { VideoListComponent } from './components/video-list/video-list.component';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [VideoMainComponent, VideoListComponent, ErrorComponent],
  imports: [
    CommonModule,
    VideoRoutingModule
  ],
  exports :[
    VideoMainComponent, 
    VideoListComponent,
    ErrorComponent
  ]
})
export class VideoModule { }

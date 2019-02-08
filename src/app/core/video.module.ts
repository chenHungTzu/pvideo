import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoRoutingModule } from './video-routing.module';
import { VideoMainComponent } from './components/video-main/video-main.component';
import { ErrorComponent } from './components/error/error.component';

@NgModule({
  declarations: [
    VideoMainComponent, 
    ErrorComponent, 
  ],
  imports: [
    CommonModule,
    VideoRoutingModule
  ],
  exports: [
    VideoMainComponent,
    ErrorComponent
  ]
})
export class VideoModule { }

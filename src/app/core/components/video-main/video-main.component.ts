import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { style, animate, transition, trigger, state, query } from '@angular/animations';

declare const $;

@Component({
  selector: 'app-video-main',
  templateUrl: './video-main.component.html',
  styleUrls: ['./video-main.component.scss'],
  animations: [
    trigger('toggle', [
      state('down', style({ 'height': '0vh', 'min-height': '0vh', 'padding-top': '0vh' })),
      state('up', style({ 'height': '40vh', 'min-height': '50vh', 'padding-top': '5vh' })),
      transition('down => up', [
        animate('.3s')
      ]),
      transition('up => down', [
        animate('.3s')
      ])
    ]),
    trigger('fadeInOut', [
      state('in', style({ 'opacity': '1' ,'display': 'initial'})),
      state('out', style({ 'opacity': '0' ,'display': 'none'})),
      state('short', style({ 'height': '0px' })),
      state('long', style({ 'height': '1000px' })),
      transition('in => out', [
        animate('.3s'),
        query('.content',[
          transition('short => long', [
            animate('.5s')
          ])
         
        ])
      ]),
      transition('out => in', [
        animate('.3s'),
        transition('long => short', [
          animate('.5s')
        ])
      ]),
      // transition('short => long', [
      //   animate('.5s')
      // ]),
      // transition('long => short', [
      //   animate('.5s')
      // ])
    ]),
  ]
})
export class VideoMainComponent implements OnInit, AfterViewInit {


  @ViewChild('video') video: ElementRef;
  @ViewChild('progress') progress: ElementRef;

  description : boolean = false;
  show: boolean = false;
  time: string = '';

  constructor() { }

  ngOnInit() {

  }
  get progressRef() {
    return this.progress.nativeElement as HTMLElement;
  }
  get videoRef() {
    return this.video.nativeElement as HTMLVideoElement;
  }

  ngAfterViewInit(): void {

    this.eventBinding();
  }


  eventBinding() {

    this.videoRef.addEventListener('timeupdate', () => {
      let percentage = Math.floor((100 / this.videoRef.duration) * this.videoRef.currentTime);
      let second = this.videoRef.duration - this.videoRef.currentTime;
      let date = new Date(null);
      date.setSeconds(second);

      this.progressRef.style.width = percentage + '%'
      this.time = date.toISOString().substr(14, 5);

    }, false);

    $(".progress-bar > div").draggable({
      axis: "x",
      containment: ".progress",
      drag: ( event, ui ) =>{ 
        let main = $('.progress').width();
        let move = parseFloat($('.progress-bar > div').css('left').replace('px', ''));
        let time = ((move)/main) * this.videoRef.duration;
        this.videoRef.currentTime = time;
       
      
      },
      stop: ( event, ui )=> {
        $('.progress-bar > div').css('left' , '');
      }
    });

  }



}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { style, animate, transition, trigger, state, query } from '@angular/animations';
import * as io from 'socket.io-client';

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
      state('in', style({ 'opacity': '1', 'display': 'initial' })),
      state('out', style({ 'opacity': '0', 'display': 'none' })),
      state('short', style({ 'height': '0px' })),
      state('long', style({ 'height': '1000px' })),
      transition('in => out', [
        animate('.3s'),
        query('.content', [
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
    ]),
  ]
})
export class VideoMainComponent implements OnInit, AfterViewInit {


  wsserver   = 'https://217a2882.ngrok.io';
  stunserver = 'stun:stun.l.google.com:19302'

  @ViewChild('video')    video: ElementRef;
  @ViewChild('rtc')      rtcv: ElementRef;
  @ViewChild('progress') progress: ElementRef;

  clients        = [];            // user's list
  rtcm : boolean = false;         // is rtc mode
  socket: any;                    // ws server
  displayDesc: boolean  = false;  // is show description's block
  displaylist: boolean  = true;   // is show list's block
  time: string   = '';            // video time display


  lpc: RTCPeerConnection;    // p2p end point (local)
  rpc: RTCPeerConnection;    // p2p end point (remote)

  get progressRef() : HTMLElement {
    return this.progress.nativeElement as HTMLElement;
  }
  get videoRef() : HTMLVideoElement{
    return this.video.nativeElement as HTMLVideoElement;
  }
  get rtcRef() : HTMLVideoElement {
    return this.rtcv.nativeElement as HTMLVideoElement;
  }


  constructor() { }

  ngOnInit(): void {
    //this.preparews();
    //this.preparepc();
  }
  ngAfterViewInit(): void {
    this.eventBinding();
  }
  eventUnBind(){ 
    $(".progress-bar > div").draggable('disable');
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
      drag: (event, ui) => {
        let main = $('.progress').width();
        let move = parseFloat($('.progress-bar > div').css('left').replace('px', ''));
        let time = ((move) / main) * this.videoRef.duration;
        this.videoRef.currentTime = time;


      },
      stop: (event, ui) => {
        $('.progress-bar > div').css('left', '');
      }
    });

  }

  onwscandidate(data) {

    console.log("socket [candidate]");

    if (!data.candidate) return;

    this.lpc.addIceCandidate(new RTCIceCandidate(data.candidate));
  }

  onwsanswer(data) {

    console.log("socket [answer]")

    if (!data.answer) return;

    this.lpc.setRemoteDescription(new RTCSessionDescription(data.answer))
    .then(() => console.log('socket get answer'))
    .catch(error => console.error('answer error:', error));

  }

  onwsoffer(data){ 

    console.log("socket [offer]");

    this.lpc.setRemoteDescription(new RTCSessionDescription(data.payload))
    .then(() => this.lpc.createAnswer())
    .then((answer) => {
      this.lpc.setLocalDescription(answer);
      return answer
    })
    .then((answer) => {
      this.socket.emit('answer', { "answer": answer , "id" : data.id });
    }).catch(error => {
      console.error('offer error:', error)
    });

  }

  onwsconnect(data){
    console.log("socket [connect]");
    this.socket.emit('setinfo', { 
      cid: Math.random().toString(),
      cimg : 'https://media.glamour.com/photos/58336fd44e6d66172e161a3a/master/w_1280,c_limit/0117-GL-LIFE01-02.jpg'
    });
  }

  onwsclients(data){
    console.log("socket [clients]");
    this.clients = data;
  }

  preparews() {
    this.socket = io.connect(this.wsserver);
    this.socket.on('clients', this.onwsclients.bind(this));
    this.socket.on('connect', this.onwsconnect.bind(this));
    //this.socket.on('candidate', this.onwscandidate.bind(this));
    this.socket.on('answer', this.onwsanswer.bind(this));
    this.socket.on('offer', this.onwsoffer.bind(this));
  }


  onpcicecandidate(evt) {
    console.log('stun [onicecandidate]');
    if (evt.candidate)
      this.socket.emit('candidate', { "candidate": evt.candidate });
  }

  onpcnegotiationneeded() {
    console.log('stun [onicecandidate]');
  }

  onpctrack(evt : RTCTrackEvent){
    console.log('stun [ontrack]');
    this.rtcRef.srcObject = evt.streams[0];
    this.rtcRef.play();
    this.gemr();
  }

  createoffer(id){
    console.log('stun [createoffer]')
    this.lpc.createOffer() 
    .then((desc)=>  {
      this.lpc.setLocalDescription(desc);
      return desc
    })
    .then((desc)=>this.socket.emit('offer', { "offer": desc , "id" : id}))
  }

  preparepc(){
    this.lpc = new RTCPeerConnection({ iceServers: [{ urls: this.stunserver }] });
    this.lpc.onicecandidate = this.onpcicecandidate.bind(this);
    this.lpc.onnegotiationneeded = this.onpcnegotiationneeded.bind(this);
    this.lpc.ontrack = this.onpctrack.bind(this);  
  }

  requestUserMedia(){

    navigator.getUserMedia = navigator.getUserMedia;
    let constraints = { audio: true, video: true };
    navigator.getUserMedia(constraints, this.retrieveStream.bind(this), (error) => {
      console.log("getUserMedia error: ", error);
    });

  }

  retrieveStream(stream){
    stream.getTracks().forEach(track => this.lpc.addTrack(track, stream));
  }

  openrtc($event) {
    this.socket.emit('getclients')
    this.requestUserMedia();
    this.preparepc();
 
  }

  gemv(){
    this.rtcm = false;
  }


  gemr(){
    this.rtcm = true;
    this.eventUnBind();
   
  }
  offer(id){
    this.createoffer(id);
  }



}

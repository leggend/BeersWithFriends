import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { EventModel } from '../../models';
import { EventsService } from '../../services';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';

@Component({
  selector: 'page-event-info',
  templateUrl: 'event-info.html'
})
export class EventInfoPage {
  protected pictureTeken: boolean = false;
  
  private options: CameraOptions = {
    quality: 50, 
    destinationType: this.camera.DestinationType.FILE_URI,
    targetHeight: 1024, 
    targetWidth: 1024,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE
  }

  public data: EventModel = new EventModel();
  constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        public events: Events,
        public eventsSrv: EventsService
        , private file: File
        , private camera: Camera
      ) 
  {
  }
    
  ionViewDidLoad() {
    this.eventsSrv.getCurrentEvent().then(val=>{
      if(val) this.data = val;
    });
  }

  ionViewWillLeave(){
    this.eventsSrv.saveData(this.data);
  }

  dataHasChanged(evnet: any){
    this.eventsSrv.saveData(this.data);
  }

  takePicture(){
    this.camera.getPicture(this.options).then((imageData) => {
      if(this.data.picture && this.data.picture!=""){
        this.deleteImageFile();
      }
      this.data.picture = imageData;
      this.eventsSrv.saveData(this.data);
    }, (err) => {
        alert("erroR: "+ JSON.stringify(err));
    });
  }

  
  deleteImageFile(){
    if(this.data.picture && this.data.picture.length>0){
        let path = "";
        let initPos = 0;
        let pos = 0;
        while(pos>=0){
            pos = this.data.picture.indexOf("/", initPos);
            if(pos>=0){
                initPos = pos+1;
            }
        }
        path = this.data.picture.slice(0,initPos);
        let file = this.data.picture.slice(initPos);
        
        this.file.checkFile(path, file).then((exist)=>{
            if(exist){
                this.file.removeFile(path, file).then((res)=>{
                  this.eventsSrv.saveData(this.data);
                }).catch((err)=>{ 
                  
                });
            }
        }).catch((err)=>{
          
        });
    }
  } 
}

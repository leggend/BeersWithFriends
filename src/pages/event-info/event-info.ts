import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { EventModel } from '../../models';
import { EventsService } from '../../services';
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
      this.data.picture = imageData;
      this.eventsSrv.saveData(this.data);
    }, (err) => {
        alert("erroR: "+ JSON.stringify(err));
    });
  }
}

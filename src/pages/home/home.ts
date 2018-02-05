import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { File } from '@ionic-native/file';

import { EventsPage } from '../';
import { EventsService } from '../../services';
import { EventModel, EventFriendModel } from '../../models';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  private translations: any = {};
  protected events: EventModel[] = [];
  constructor(
    public navCtrl: NavController, 
    private storage: Storage,
    private file: File,
    private translate: TranslateService, 
    private alertCtrl: AlertController,
    private eventsSrv: EventsService) 
  {

    this.storage.get('language').then((val) => {
      this.translate.get([
          'EVENT_PAGE.DEFAULT_TITLE',
          'EVENT_PAGE.ME',
          'HOME_PAGE.TITLE_CONFIRM',
          'HOME_PAGE.MESS_CONFIRM_DELETE_EVENT',
          'HOME_PAGE.CANCEL',
          'HOME_PAGE.DELETE'
        ]).subscribe(
        values => {
          this.translations = values;
        }
      );
    });
  
  }

  ionViewWillEnter(){
    this.eventsSrv.getEventsAll().then(data=>{
      this.events = data;
    });
  }

  newEvent(){
    this.eventsSrv.getNewEventId().then(newId=>{
      let newEvent = new EventModel();
      newEvent.id = newId;
      newEvent.title = this.translations['EVENT_PAGE.DEFAULT_TITLE'];
      let friend = new EventFriendModel();
      friend.name = this.translations['EVENT_PAGE.ME'];
      newEvent.friends.push(friend);
      this.eventsSrv.saveData(newEvent).then(res=>{
        this.navCtrl.push(EventsPage);
      })
    });
  }

  editEvent(event: EventModel){
    this.eventsSrv.saveData(event).then(res=>{
      this.navCtrl.push(EventsPage);
    });
  }

  deleteEvent(event: EventModel){
    let alert = this.alertCtrl.create({
      title: this.translations['HOME_PAGE.TITLE_CONFIRM'],
      message: this.translations['HOME_PAGE.MESS_CONFIRM_DELETE_EVENT'],
      buttons: [
        {
          text: this.translations['HOME_PAGE.CANCEL'],
          role: 'cancel',
          handler: () => { }
        },
        {
          text: this.translations['HOME_PAGE.DELETE'],
          handler: () => {
            this.deleteImageFile(event);
            this.eventsSrv.deleteEvent(event).then(res=>{
              this.eventsSrv.getEventsAll().then(data=>{
                this.events = data;
              });
            });
          }
        }
      ]
    });
    alert.present();
  }
  
  deleteImageFile(event: EventModel){
    if(event.picture && event.picture.length>0){
      let path = "";
      let initPos = 0;
      let pos = 0;
      while(pos>=0){
          pos = event.picture.indexOf("/", initPos);
          if(pos>=0){
              initPos = pos+1;
          }
      }
      path = event.picture.slice(0,initPos);
      let file = event.picture.slice(initPos);
      
      this.file.checkFile(path, file).then((exist)=>{
          if(exist){
              this.file.removeFile(path, file).then((res)=>{
                this.eventsSrv.saveData(event);
              }).catch((err)=>{ 
                
              });
          }
      }).catch((err)=>{
        
      });
    }
  }
  
}

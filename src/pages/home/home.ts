import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

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
}

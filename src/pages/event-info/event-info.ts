import { Component } from '@angular/core';
import { NavController, NavParams, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { EventModel } from '../../models';
import { EventsService } from '../../services';

@Component({
  selector: 'page-event-info',
  templateUrl: 'event-info.html'
})
export class EventInfoPage {
  private currentLang: string = "en";
  private translations: any = {};
  private hasChanged: boolean = false;

  public data: EventModel = new EventModel();

  constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        private storage: Storage,
        public events: Events,
        public eventsSrv: EventsService,
        private translate: TranslateService) 
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
  
}

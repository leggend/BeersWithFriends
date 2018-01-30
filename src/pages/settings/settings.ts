import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, AlertController, Events } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  private _langs: any[] = [ 
    {text: 'Español', value: 'es'}, 
    {text: 'Catalá', value: 'ca'},
    {text: 'English', value: 'en'}, 
  ];

  private currentLang: string = "en";
  private translations: any = {};


  constructor(
        public navCtrl: NavController, 
        public navParams: NavParams, 
        private storage: Storage,
        public events: Events,
        private translate: TranslateService) 
  {
  }
    
  ionViewDidLoad() {
    this.storage.get('language').then((val) => {
      if(val && val!='') this.currentLang = val;
    });
  }

  languageChange(event){
    this.storage.set('language', this.currentLang);
    this.translate.setDefaultLang(this.currentLang);
    this.events.publish('language:changed', this.currentLang, Date.now());
  }
}

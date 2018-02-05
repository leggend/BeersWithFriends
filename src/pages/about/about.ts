import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AppVersion } from '@ionic-native/app-version';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
    constructor(public navCtrl: NavController, 
      public navParams: NavParams, 
      private appVersion: AppVersion) {
    }
  
    protected version: string = "0.0.1";
  
    ionViewDidLoad() {
      this.appVersion.getVersionNumber().then(valor=>{
        this.version = valor;
      })
    }

}

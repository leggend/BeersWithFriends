import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
    constructor(public navCtrl: NavController, 
        public navParams: NavParams, 
        private translate: TranslateService) {
      }
    
      private version: string = "1.0.0";
    
      ionViewDidLoad() {
      }

}

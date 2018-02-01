import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
    constructor(public navCtrl: NavController, 
        public navParams: NavParams) {
      }
    
      protected version: string = "1.0.0";
    
      ionViewDidLoad() {
      }

}

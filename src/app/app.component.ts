import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';

import { HomePage, AboutPage, EventsPage, SettingsPage } from '../pages';
import { EventModel } from '../models';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  pages: Array<{title: string, icon: string, component: any}>;

  data: EventModel[] = [];
  private translations: any[] = [];
  private currentLang: string = "en";
  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    private storage: Storage,
    private events: Events,
    private translate: TranslateService,) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [];

  }

  initializeApp() {
    this.storage.get('language').then((val) => {
      if(val && val!='') this.currentLang = val;
      this.translate.setDefaultLang(this.currentLang);
      this.loadMenu();
    });

    this.events.subscribe('language:changed', (language, time) => {
      this.translate.setDefaultLang(language);
      this.loadMenu();
    });

    this.translate.setDefaultLang(this.currentLang);

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.loadMenu();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component, this.data);
  }

  loadMenu(){
    this.translate.get([
      'MainMenu.HOME',
      'MainMenu.EVENT',
      'MainMenu.SETTINGS',
      'MainMenu.ABOUT'
      ]).subscribe(
        values => {
          this.translations = values;
          // used for an example of ngFor and navigation
          this.pages = [
            { title: this.translations['MainMenu.HOME'], icon: 'fa-home', component: HomePage },
            { title: this.translations['MainMenu.EVENT'], icon: 'fa-calendar', component: EventsPage },
            { title: this.translations['MainMenu.SETTINGS'], icon: 'fa-cogs', component: SettingsPage },
            { title: this.translations['MainMenu.ABOUT'], icon: 'fa-user-circle', component: AboutPage }
          ];
            
        }
      );
  }   
}

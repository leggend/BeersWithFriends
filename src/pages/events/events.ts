import { Component } from '@angular/core';
import { IonicPage, NavController, Events } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { EventModel, EventFriendModel } from '../../models';
import { EventInfoPage } from '..';
import { EventsService } from '../../services';

/**
 * Generated class for the EventsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-events',
  templateUrl: 'events.html',
})
export class EventsPage {

  public data: EventModel = new EventModel();
  private translations: any = {};
  private hasChanged: boolean = false;

  constructor(public navCtrl: NavController, 
    private translate: TranslateService, 
    private alertCtrl: AlertController ,
    public events: Events,
    public eventsSrv: EventsService
) {
    this.translate.get([
        'EVENT_PAGE.TITLE_CONFIRM',
        'EVENT_PAGE.MESS_CONFIRM_DELETE_DRINK',
        'EVENT_PAGE.MESS_CONFIRM_DELETE_FRIEND',
        'EVENT_PAGE.MESS_CONFIRM_DELETE_ALL',
        'EVENT_PAGE.CANCEL',
        'EVENT_PAGE.DELETE',
        'EVENT_PAGE.NEW_FRIEND',
        'EVENT_PAGE.NEW_DRINK',
        'EVENT_PAGE.DEFAULT_TITLE',
        'EVENT_PAGE.ME',
      ]).subscribe(
      values => {
          this.translations = values;
      }
    );
  }

  ionViewDidLoad() {
    this.data.title = this.translations['EVENT_PAGE.DEFAULT_TITLE'];
  }

  ionViewWillEnter(){
    this.eventsSrv.getCurrentEvent().then(val=>{
      if(val) this.data = val;
      else{
        this.eventsSrv.getNewEventId().then(newId=>{
          let event = new EventModel();
          event.id = newId;
          event.title = this.translations['EVENT_PAGE.DEFAULT_TITLE'];
          let friend = new EventFriendModel();
          friend.name = this.translations['EVENT_PAGE.ME'];
          event.friends.push(friend);
          this.eventsSrv.saveData(event).then(res=>{
            this.data = event;
          });
        })
      }
    });
  }

  newFriend(){
    let newFriend = new EventFriendModel();
    newFriend.name = this.translations['EVENT_PAGE.NEW_FRIEND'];
    this.data.friends.push(newFriend);
    this.hasChanged = true;
    this.eventsSrv.saveData(this.data).then(res=>{this.hasChanged = false;})
  }

  newDrink(friend: any){
    friend.drinks.push({name:this.translations['EVENT_PAGE.NEW_DRINK'], number: 0});
    this.hasChanged = true;
    if(this.hasChanged){
      if(!this.data.title) this.data.title = this.translations["EVENT_PAGE.DEFAULT_TITLE"];
      this.eventsSrv.saveData(this.data).then(res=>{ this.hasChanged = false;});
    }
  }

  removeDrink(drink: any, friend: any){
    if(drink.number>0){
      drink.number--;
      friend.beers--;
      this.data.total--;
      this.hasChanged = true;
      if(this.hasChanged){
        if(!this.data.title) this.data.title = this.translations["EVENT_PAGE.DEFAULT_TITLE"];
        this.eventsSrv.saveData(this.data).then(res=>{ this.hasChanged = false;});
      }
    }
  }

  addDrink(drink: any, friend: any){
    drink.number++;
    friend.beers++;
    this.data.total++;
    this.hasChanged = true;
    if(this.hasChanged){
      if(!this.data.title) this.data.title = this.translations["EVENT_PAGE.DEFAULT_TITLE"];
      this.eventsSrv.saveData(this.data).then(res=>{ this.hasChanged = false;});
    }
  }

  changeFriendShow(friend: any){
    friend.show = !friend.show;
  }

  deleteDrink(idxDrink: number, friend: any){
    let alert = this.alertCtrl.create({
      title: this.translations['EVENT_PAGE.TITLE_CONFIRM'],
      message: this.translations['EVENT_PAGE.MESS_CONFIRM_DELETE_DRINK'],
      buttons: [
        {
          text: this.translations['EVENT_PAGE.CANCEL'],
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: this.translations['EVENT_PAGE.DELETE'],
          handler: () => {
            let drink = friend.drinks[idxDrink];
            var drinks = drink.number;
            if (idxDrink > -1) {
              friend.beers = friend.beers - drinks;
              friend.drinks.splice(idxDrink, 1);
              this.data.total -= drinks;
              this.hasChanged = true;
            }
            if(this.hasChanged){
              if(!this.data.title) this.data.title = this.translations["EVENT_PAGE.DEFAULT_TITLE"];
              this.eventsSrv.saveData(this.data).then(res=>{ this.hasChanged = false;});
            }
          }
        }
      ]
    });
    alert.present();    
  }

  deleteFriend(idxFriend: number, drinks: number){
    let alert = this.alertCtrl.create({
      title: this.translations['EVENT_PAGE.TITLE_CONFIRM'],
      message: this.translations['EVENT_PAGE.MESS_CONFIRM_DELETE_FRIEND'],
      buttons: [
        {
          text: this.translations['EVENT_PAGE.CANCEL'],
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: this.translations['EVENT_PAGE.DELETE'],
          handler: () => {
            if (idxFriend > -1) {
              //friend.beers = friend.beers - drinks;
              this.data.friends.splice(idxFriend, 1);
              this.data.total = this.data.total - drinks;
              this.hasChanged = true;
            }
            if(this.hasChanged){
              if(!this.data.title) this.data.title = this.translations["EVENT_PAGE.DEFAULT_TITLE"];
              this.eventsSrv.saveData(this.data).then(res=>{ this.hasChanged = false;});
            }
          }
        }
      ]
    });
    alert.present();  
  }
  
  navigateInfoPage(){
    this.navCtrl.push(EventInfoPage);
  }


  deleteAll(){
    let alert = this.alertCtrl.create({
      title: this.translations['EVENT_PAGE.TITLE_CONFIRM'],
      message: this.translations['EVENT_PAGE.MESS_CONFIRM_DELETE_ALL'],
      buttons: [
        {
          text: this.translations['EVENT_PAGE.CANCEL'],
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: this.translations['EVENT_PAGE.DELETE'],
          handler: () => {
            let me = new EventFriendModel();
            me.name = this.translations["EVENT_PAGE.ME"];
            this.data = new EventModel();
            this.data.friends.push(me);
            this.data.title = this.translations["EVENT_PAGE.DEFAULT_TITLE"];
            this.hasChanged = true;
            if(this.hasChanged){
              if(!this.data.title) this.data.title = this.translations["EVENT_PAGE.DEFAULT_TITLE"];
              this.eventsSrv.saveData(this.data).then(res=>{ this.hasChanged = false;});
            }
          }
        }
      ]
    });
    alert.present();  
  }

  dataHasChanged(value: any){
    this.hasChanged = true;
    if(this.hasChanged){
      if(!this.data.title) this.data.title = this.translations["EVENT_PAGE.DEFAULT_TITLE"];
      this.eventsSrv.saveData(this.data).then(res=>{ this.hasChanged = false;});
    }
  }
}

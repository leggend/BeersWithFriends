import { Component, Input } from '@angular/core';

/**
 * Generated class for the FriendDrinksComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'friend-drinks',
  templateUrl: 'friend-drinks.html'
})
export class FriendDrinksComponent {
  @Input() friend: any = {name: 'New Friend', beers: 0, show: false, drinks:[]};
  text: string;

  constructor() {
    console.log('Hello FriendDrinksComponent Component');
    this.text = 'Hello World';
  }

}

import { FriendDrinkModel } from './';

export class EventFriendModel{
    public name: string = "";
    public beers: number = 0;
    public show: boolean = false;
    public drinks: FriendDrinkModel[] = [];
}
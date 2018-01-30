import { EventFriendModel } from './';
export class EventModel{
    public id: number = 1;
    public date: Date = new Date();
    public title: string = "";
    public total: number = 0;
    public picture: string = "";
    public friends: EventFriendModel[] = [];
}

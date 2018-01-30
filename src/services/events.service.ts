import { Injectable } from '@angular/core';  
import { EventModel } from '../models';
import { Storage } from '@ionic/storage';

@Injectable()export class EventsService {

    constructor( private storage: Storage ) {}

    public getNewEventId(): Promise<number>{
        let id: number = 1;
        return this.getEventsAll().then(events=>{
            let maxId = 0;
            if(events && events.length>0){
                for(let c=0; c<events.length;c++){
                    if(events[c].id>maxId) maxId = events[c].id;
                }
            }
            id = maxId+1;
            return id;
        });
    }

    public getEventsAll(): Promise<EventModel[]> {
        return this.storage.keys().then(keys=>{
            let exist = false;
            for(let i=0;i<keys.length;i++){
                if(keys[i]==='eventsList'){
                    exist = true;
                    break;
                }
            }
            if(exist){
                return this.storage.get('eventsList').then((events: EventModel[])=>{
                    return events;
                }).catch(error=> { throw error;});
            }else{
                this.storage.set('eventsList', []);
                return [];
            }
        });
    }

    public getCurrentEvent(): Promise<EventModel>{
        return this.storage.get('currentEvent').then((val: EventModel) => {
            return val;
        });
    }

    public saveEvent(event: EventModel){
        let eventsFinal = [];
        return this.getEventsAll().then(events=>{
            let index = -1;
            if(events && events.length>=0){
                eventsFinal = events;
                for(let c=0; c<eventsFinal.length;c++){
                    if(eventsFinal[c].id==event.id){
                        index = c;
                        break;
                    }
                }
            }
            if(index>=0){
                eventsFinal[index] = event;
            }else{
                eventsFinal.push(event);
            }
            this.storage.set('eventsList', eventsFinal);
            return this.storage.set('currentEvent', event);
        });
    }

    public saveData(event: EventModel): Promise<any> {
        if(!event.id){
            this.getNewEventId().then(newId=>{
                event.id = newId;
                return this.saveEvent(event);
            });
        }else{
            return this.saveEvent(event);
        }
    }
    
    public deleteEvent(event:EventModel): Promise<any>{
        return this.storage.get('currentEvent').then((val: EventModel) => {
            let isCurrent = false;
            if(val && val.id === event.id){
                 isCurrent=true;
                 this.storage.set('currentEvent', null);
            }
            return this.getEventsAll().then(events=>{
                let index = -1;
                for(let i=0; i<events.length;i++){
                    if(events[i].id===event.id){
                        index = i;
                        break;
                    }
                }
                if(index>=0){
                    events.splice(index,1);
                }
                return this.storage.set('eventsList', events);
            });
        });
    }
}
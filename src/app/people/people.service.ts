import { Injectable } from '@angular/core';
import { Person } from '../model';
import { AppService } from '../app.service';
import * as Repository from '../repository';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {

  constructor(private appService: AppService) { }

  personUpdated(data: Person) {
    if(!data.getter('homeworldName') || data.getter('films').length !== data.getter('filmsList').length) {
     return false; 
    }
    return true;
  }

  personUpdator(data: Person) {
    
    if(!data.getter('homeworldName')) {
      if(Repository.dataFinder("planets", data.getter('homeworld'))) {
        data.setter('homeworldName', Repository.dataFinder("planets", data.getter("homeworld")).getter('name'));
      } else {
        this.appService.getAPIwithExactPath(data.getter('homeworld')).subscribe(planet => {
          data.setter('homeworldName', planet["name"]);
          Repository.dataAdder(Repository.parseJSON(planet));
        });
      }
    }

    if(data.getter('films').length !== data.getter('filmsList').length) {
      data.setter('filmsList', new Array<string>());
      data.getter('films').map(filmUrl => {
        if(Repository.dataFinder('films', filmUrl)) {
          data.getter('filmsList').push(Repository.dataFinder('films', filmUrl).getter('title'));
        } else {
          this.appService.getAPIwithExactPath(filmUrl).subscribe(film => {
            data.getter('filmsList').push(film["title"]);
            Repository.dataAdder(Repository.parseJSON(film));
          });
        }
      });
    }
    
    return data;
  }
}

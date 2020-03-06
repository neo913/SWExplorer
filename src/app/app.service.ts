import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  API_URL = 'https://swapi.co/api/';

  constructor(private http: HttpClient) { }

  getAPI(type:string, id?: number) {
    let path = this.API_URL + type + "/";
    id ? path += id + "/" : null;
    return this.http.get(path);
  }
}

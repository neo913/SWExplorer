import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  API_URL = 'https://swapi.co/api/';

  constructor(private http: HttpClient) { }

  getAPI() {
    return this.http.get(this.API_URL+'people/1/');
  }
}

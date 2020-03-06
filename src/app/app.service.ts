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
    path = this.parameterCleaner(path);
    return this.http.get(path);
  }

  getAPIwithExactPath(path: string) {
    path = this.parameterCleaner(path);
    return this.http.get(path);
  }

  parameterCleaner(param: any) {
    if(!/\/$/gm.test(param)) {
      param += "/";
    }
    return param;
  }
}

import { Person, Planet, Film } from "./model";

export let peopleData:  Person[];
export let peopleIndex: number;
export let peopleTotal: number;

export let planetsData:  Planet[];
export let planetsIndex: number;
export let planetsTotal: number

export let filmsData:  Film[];
export let filmsIndex: number;
export let filmsTotal: number;

export function dataFinder(type?: string, url?: string, _id?: number) {
  let target: any[];
  if(!type && url) { type = typeFinder(url); }
  switch(type) {
    case "people": target = peopleData; break;
    case "planets": target = planetsData; break;
    case "films": target = filmsData; break;
    default: return;
  }

  let result;
  try {
    if(!target) { return null; }
    if(url && !_id) { _id = getNumber(url); }
    result = target.find(data => data.getter("_id") === _id);
  } catch(err) {
    return null;
  }
  return result;
}

export function typeFinder(url: string) {
  if      (url.indexOf("people")  != -1) { return "people"; }
  else if (url.indexOf("planets") != -1) { return "planets"; }
  else if (url.indexOf("films")   != -1) { return "films"; }
  else { return null; }
}

export function dataAdder(data: any) {
  switch(typeFinder(data.getter('url'))) {
    case 'people' : if(!peopleData || peopleData.length == 0) { peopleData = new Array<Person>(); }
                    if(dataFinder("people", data.getter('url'))) {
                      peopleData.splice(peopleData.findIndex(item => item.getter('url') === data.getter('url')), 1);
                    }
                    peopleData.push(data);
                    dataSort("people");
                    break;
    case 'planets': if(!planetsData || planetsData.length == 0) { planetsData = new Array<Planet>(); }
                    if(dataFinder("planets", data.getter('url'))) {
                      planetsData.splice(planetsData.findIndex(item => item.getter('url') === data.getter('url')), 1);
                    }
                    planetsData.push(data);
                    dataSort("planets");
                    break;
    case 'films'  : if(!filmsData || filmsData.length == 0) { filmsData = new Array<Film>(); }
                    if(dataFinder("films", data.getter('url'))) {
                      filmsData.splice(filmsData.findIndex(item => item.getter('url') === data.getter('url')), 1);
                    }
                    filmsData.push(data);
                    dataSort("films");
                    break;
    default       : break;
  }
  
}

export function parseJSON(data: object) {
  let keys = Object.keys(data);
  let type = typeFinder(data["url"]);
  let obj;

  switch(type) {
    case "people":  obj = new Person(); break;
    case "planets": obj = new Planet(); break;
    case "films":  obj = new Film(); break;
    default: break;
  }
  for(let key of keys) {
    obj.setter(key, data[key]);
    obj.setter("_id", getNumber(data["url"]));
  }
  return obj;
}

export function getNumber(string: string) {
  if(string.substr(string.length -1, string.length) == '/') {
    string = string.substr(0, string.length -1);
 }
  return parseInt(string.match(/([^\/]+$)/)[1]);
}

export function valueSetter(key: string, value: number) {
  switch(key) {
    case "peopleIndex":   peopleIndex = value;  break;
    case "peopleTotal":   peopleTotal = value;  break;
    case "planetsIndex":  planetsIndex = value; break;
    case "planetsTotal":  planetsTotal = value; break;
    case "filmsIndex":    filmsIndex = value;   break;
    case "filmsTotal":    filmsTotal = value;   break;
    default: break;
  }
}

export function dataSort(type: string) {
  let target;
  switch(type) {
    case "people":  target = peopleData  ; break; 
    case "planets": target = planetsData ; break; 
    case "films":   target = filmsData   ; break; 
    default:        break;
  }
  if(target && target.length > 0) {
    target.sort((a, b) =>    { return a.getter('_id') - b.getter('_id'); });;
  }
}
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

export function test() {
  console.log(peopleData);
  console.log(planetsData);
  console.log(filmsData);
}

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
  if      (url.search("people"))  { return "people"; }
  else if (url.search("planets")) { return "planets"; }
  else if (url.search("films"))   { return "films"; }
  else { return null; }
}

export function dataTransformedChecker(type: any, id?: number) {
  let result = true;
  let target;
  switch(type) {
    case "people":      if(!id) {
                          target = peopleData  ;
                          target.map(item => {
                            if(!item.getter("homeworld") || !item.getter('filmsList') || item.getter('filmsList').length == 0) { result = false; }
                          });
                        } else {
                          target = dataFinder("people", null, id);
                          if(!target.getter("homeworld") || !target.getter('filmsList') || target.getter('filmsList').length == 0) { result = false; }
                        }
                        break;

    case "planets":     if(!id) {
                          target = planetsData  ;
                          target.map(item => {
                            if(!item.getter("residentsList") || item.getter("residentsList").length == 0 || !item.getter('filmsList') || item.getter('filmsList').length == 0) { result = false; }
                          });
                        } else {
                          target = dataFinder("planets", null, id);
                          if(!target.getter("residentsList") || target.getter("residentsList").length == 0 || !target.getter('filmsList') || target.getter('filmsList').length == 0) { result = false; }
                        }
                        break;

    case "films":       if(!id) {
                          target = filmsData  ;
                          target.map(item => {
                            if(!item.getter("charactersList") || item.getter("charactersList").length == 0 || !item.getter('planetsList') || item.getter('planetsList').length == 0) { result = false; }
                          });
                        } else {
                          target = dataFinder("films", null, id);
                          if(!target.getter("charactersList") || target.getter("charactersList").length == 0 || !target.getter('planetsList') || target.getter('planetsList').length == 0) { result = false; }
                        }
                        break;

    default:            break;
  }
  return result;
}

export function dataGetter(type: string) {
  switch(type) {
    case "people": return peopleData;
    case "planets": return planetsData;
    case "films":  return filmsData;
    default: return null;
  }
}

export function peopleDataAdder(data: Object ) {
  if(!peopleData || peopleData.length == 0) { peopleData = new Array<Person>(); }
  if(!dataFinder("people", data["url"])) {
    peopleData.push(parseJSON(data, "people"));
  }
}

export function planetsDataAdder(data: Object) {
  if(!planetsData || planetsData.length == 0) { planetsData = new Array<Planet>(); }
  if(!dataFinder("planets", data["url"])) {
    planetsData.push(parseJSON(data, "planets"));
  }
}

export function filmsDataAdder(data: Object) {
  if(!filmsData) { filmsData = new Array<Film>(); }
  if(!dataFinder("films", data["url"])) {
     filmsData.push(parseJSON(data, "films"));
  };
}

export function indexSetter(type: string, idx: number) {
  switch(type) {
    case "people":  peopleIndex = idx; break;
    case "planets": planetsIndex = idx; break;
    case "films":  filmsIndex  = idx; break;
    default: break;
  }
}

export function parseJSON(data: Object, type: string) {
  let keys = Object.keys(data);
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
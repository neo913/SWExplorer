abstract class _Base {
  getter(property?: string) { if(property) { return this[property]; } return this; }
  setter(property: string, value: any) { this[property] = value; }
}

export class Person extends _Base {
  private _id:            number;
  private name:           string;
  private height:         string;
  private mass:           string;
  private hair_color:     string;
  private skin_color:     string;
  private eye_color:      string;
  private birth_year:     string;
  private gender:         string;
  private homeworld:      string;
  private films:          string[];
  private species:        string; // Addtional?
  private vehicles:       string; // Additional?
  private starships:      string; // Additional?
  private created:        string;
  private edited:         string;
  private url:            string;
  

  constructor(object?: Person) {
    super();
    this._id        = object && object._id          || null;
    this.name       = object && object.name         || '';
    this.height     = object && object.height       || '';
    this.mass       = object && object.mass         || '';
    this.hair_color = object && object.hair_color   || '';
    this.skin_color = object && object.skin_color   || '';
    this.eye_color  = object && object.eye_color    || '';
    this.birth_year = object && object.birth_year   || '';
    this.gender     = object && object.gender       || '';
    this.homeworld  = object && object.homeworld    || '';
    object && object.films.length > 0     ? object.films.map(x => this.films.push(x))     : this.films = new Array<string>();
    this.species    = object && object.species      || '';
    this.vehicles   = object && object.vehicles     || '';
    this.starships  = object && object.starships    || '';
    this.created    = object && object.created      || '';
    this.edited     = object && object.edited       || '';
    this.url        = object && object.url          || '';
  }
}

export class Planet extends _Base {
  private _id:              number;
  private name:             string;
  private rotation_period:  string;
  private orbital_period:   string;
  private diameter:         string;
  private climate:          string;
  private gravity:          string;
  private terrain:          string;
  private surface_water:    string;
  private population:       string;
  private residents:        string[];
  private films:            string[];
  private created:          string;
  private edited:           string;
  private url:              string;
  
  constructor(object?: Planet) {
    super();
    this._id              = object && object._id              || null;
    this.name             = object && object.name             || '';
    this.rotation_period  = object && object.rotation_period  || '';
    this.orbital_period   = object && object.orbital_period   || '';
    this.diameter         = object && object.diameter         || '';
    this.climate          = object && object.climate          || '';
    this.gravity          = object && object.gravity          || '';
    this.terrain          = object && object.terrain          || '';
    this.surface_water    = object && object.surface_water    || '';
    this.population       = object && object.population       || '';
    object && object.residents.length > 0   ? object.residents.map(x => this.residents.push(x))   : this.residents = new Array<string>();
    object && object.films.length > 0       ? object.films.map(x => this.films.push(x))           : this.films = new Array<string>();
    this.created          = object && object.created          || '';
    this.edited           = object && object.edited           || '';
    this.url              = object && object.url              || '';
  }
}

export class Film extends _Base {
  private _id:              number;
  private title:            string;
  private episode_id:       string;
  private opening_crawl:    string;
  private director:         string;
  private producer:         string;
  private release_date:     string;
  private characters:       string[];
  private planets:          string[];
  private starships:        string; // Additional?
  private vehicles:         string; // Additional?
  private species:          string; // Additional?
  private created:          string;
  private edited:           string;
  private url:              string;

  constructor(object?: Film) {
    super();
    this._id            = object && object._id              || null;
    this.title          = object && object.title            || '';
    this.episode_id     = object && object.episode_id       || '';
    this.opening_crawl  = object && object.opening_crawl    || '';
    this.director       = object && object.director         || '';
    this.producer       = object && object.producer         || '';
    this.release_date   = object && object.release_date     || '';
    object && object.characters.length > 0  ? object.characters.map(x => this.characters.push(x))   : this.characters = new Array<string>();
    object && object.planets.length > 0     ? object.planets.map(x => this.planets.push(x))         : this.planets = new Array<string>();
    this.starships      = object && object.starships        || '';
    this.vehicles       = object && object.vehicles         || '';
    this.species        = object && object.species          || '';
    this.created        = object && object.created          || '';
    this.edited         = object && object.edited           || '';
    this.url            = object && object.url              || '';
  }
}

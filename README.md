# Star Wars Explorer

This project is a personal project to show my Front End skills using Angular.

## Demo

See demo: http://tiny.cc/SWExplorer (Deployed using Firebase)

(If you have an earphone, enjoy the theme song while you are exploring the website!)

## Usage (local)

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Used
Angular CLI: 8.3.25

Node: 12.13.1

OS: win32 x64

Angular: 8.2.14

Angular Material: 8.2.3

rxjs: 6.4.0

Webpack: 4.39.2

SCSS

API resource: https://swapi.co

## Concepts

This web app is following progressive web app concenpt and fat client concept.

Tried to use Lazy loading, Dependency Injection, Interceptor, Routing, and to name but a few.

Styles are mostly followed Angular Material guide however there are several changes usinsg SCSS.

Data is from [swapi.co](https://swapi.co) and each request and responses are manged by interceptor.


## Page design

Each pages(People, Planets, Movies) are designed in different styles to show diffents skils.

`General`: Lazy loading, Fat-Client, Share, Hyperlinks to let user navigate the website easily.

`People`: Card type with carousel style, List available on modal.

`Planets`: Board type, Search, Pagination.

`Films`: Tab-Card type, Toggles.

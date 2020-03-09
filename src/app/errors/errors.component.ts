import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.scss']
})
export class ErrorsComponent implements OnInit {

  errorCode;
  errorName;
  errorDetails;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params['id']) {
        this.errorCode = params['id'];
      }
    });
    this.getErrorDetail();
  }

  getErrorDetail() {
    let detail;
    switch(this.errorCode) {
      case '400': this.errorName = 'Bad Request';
                  this.errorDetails = 'The request was invalid.';
                  break;
      case '401': this.errorName = 'Unauthorized'; 
                  this.errorDetails = 'The request did not include an authentication token or the authentication token was expired.';
                  break;
      case '403': this.errorName = 'Forbidden'; 
                  this.errorDetails = 'The client did not have permission to access the requested resource.';
                  break;
      case '404': this.errorName = 'Not Found'; 
                  this.errorDetails = 'The requested resource was not found.';
                  break;
      case '405': this.errorName = 'Method Not Allowed'; 
                  this.errorDetails = 'The HTTP method in the request was not supported by the resource. For example, the DELETE method cannot be used with the Agent API.';
                  break;
      case '409': this.errorName = 'Conflict'; 
                  this.errorDetails = 'The request could not be completed due to a conflict. For example,  POST ContentStore Folder API cannot complete if the given file or folder name already exists in the parent location.';
                  break;
      case '500': this.errorName = 'Interner Server Error'; 
                  this.errorDetails = 'The request was not completed due to an internal error on the server side.';
                  break;
      case '503': this.errorName = 'Service Unavailable'; 
                  this.errorDetails = 'The server was unavailable.';
                  break;
      default:    this.errorName = 'Unknown'; 
                  this.errorDetails = 'There is an unknown error.';
                  break;
    }
    return detail;
  }

}

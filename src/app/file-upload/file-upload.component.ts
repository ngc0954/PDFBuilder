import { Component, OnInit } from '@angular/core';
import { RequestOptions, Request, RequestMethod, Headers } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  private apiBaseUrl = "http://localhost:4000/";

  model = {
    uploadedImage: ''
  };

  constructor(private http: Http) {
  }

  ngOnInit() {
  }

  fileChange(event) {
    let filelist: FileList = event.target.files;
    if (filelist.length > 0) {
      let file: File = filelist[0];
      let formData: FormData = new FormData();
      formData.append('uploadFile', file, file.name);
      this.model.uploadedImage = file.name;
      // const headers = new Headers();
      /** In Angular 5, including the header Content-Type can invalidate your request */

      let options = new RequestOptions();
      options.headers = new Headers();
      options.headers.append('enctype', 'multipart/form-data');
      options.headers.append('Accept', 'application/json');

      let endpointFileUpload = this.apiBaseUrl + "fileupload/";

      this.http.post(`${endpointFileUpload}`, formData, options)
        .map(res => res.json())
        .catch(error => Observable.throw(error))
        .subscribe(
          data => console.log('success'),
          error => console.log(error)
        )

      /*To Bind the Uploaded image to a file.*/
      // Create the file reader  
      let reader = new FileReader();
      this.readFile(file, reader, (result) => {
      });
    }
  }

  readFile(file, reader, callback) {
    reader.onload = () => {
      callback(reader.result);
      this.model.uploadedImage = reader.result;
      // console.log(reader.result);
    }
    reader.readAsDataURL(file);
  }

}

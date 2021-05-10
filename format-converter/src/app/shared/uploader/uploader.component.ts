import { Component, OnInit } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { UploaderService } from '../services/uploader.service';
declare var $: any;

@Component({
  selector: 'uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {
  fileToUpload: File = null;
  fileToDownlad: string = null;

  formatFrom: string;
  formatTo: string;
  formats: string[] = ['csv', 'json'];
  types: string[] = ['Tekst', 'Plik'];

  fileTo: string;
  formatsWithoutSelected: string[] = new Array();
  convertedText: any;

  constructor(private uploadService: UploaderService) { }

  ngOnInit(): void { }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFile() {

    const file = this.fileToUpload;

    this.uploadService.upload(file, this.formatTo).subscribe((data: HttpResponse<any>) => {
      console.log(data.body);
      this.fileToDownlad = data.body?.message;
    });
  }

  setListFormatsTo(value: string) {
    let newArray = [...this.formats];
    const index = newArray.indexOf(value);

    if (index > -1) {
      newArray.splice(index, 1);
    }
    this.formatsWithoutSelected = newArray;
    this.formatFrom = value;
  }

  setFormatTo(value: string) {
    this.formatTo = value;
  }

  setTypeTo(value: string) {
    this.fileTo = value;
  }

  downloadFile() {
    this.uploadService.getFile(this.fileToDownlad).subscribe(
      (res: any) => {
        this.convertedText = JSON.stringify(res);
      });
  }
}

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

  formatFrom: string;
  formatTo: string;
  formats: string[] = ['CSV', 'JSON', 'XML'];
  formatsWithoutSelected: string[] = new Array();

  constructor(private uploadService: UploaderService) { }

  ngOnInit(): void { }
  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }

  uploadFile() {
    let convertRequest: any = {
      file: this.fileToUpload,
      converted: "json"
    };
    this.uploadService.upload(convertRequest).subscribe((data: any) => {
      console.log(data);
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
}

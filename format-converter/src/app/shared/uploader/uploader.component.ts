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
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  isValidFileExtension: boolean = false;
  fileInfos: Observable<any>;

  constructor(private uploadService: UploaderService) { }

  ngOnInit() { }

  selectFiles(event): void {
    this.progressInfos = [];
    this.selectedFiles = event.target.files;
    this.isValidFileExtension = this.requiredFileType(this.selectedFiles);
  }

  removeSelectedFiles() {
    this.progressInfos = [];
    this.isValidFileExtension = false;
  }

  uploadFiles() {
    this.message = '';
    let observableBatch = [];
    for (let i = 0; i < this.selectedFiles.length; i++) {
      observableBatch.push(this.upload(i, this.selectedFiles[i]));
    }
    return forkJoin(observableBatch);
  }

  upload(idx, file) {
    this.progressInfos[idx] = { value: 0, fileName: file.name };
    return this.uploadService.upload(file).pipe(
      tap((event: any) => {
        if (event.type === HttpEventType.UploadProgress) {
          this.progressInfos[idx].value = Math.round(
            (100 * event.loaded) / event.total
          );
        }
      }),
      catchError((err) => {
        this.progressInfos[idx].value = 0;
        this.message = 'Nie udało się dodać plików' + file.name;
        return err;
      })
    );
  }

  downloadFiles(path: string) {
    return (this.fileInfos = this.uploadService.getFiles(path));
  }

  private requiredFileType(
    files: FileList,
    requiredTypes: string[] = ['json']
  ): boolean {
    for (const key in files) {
      if (Object.prototype.hasOwnProperty.call(files, key)) {
        const element = files[key];
        const extension = element.name.split('.')[1].toLowerCase();
        if (!(requiredTypes.indexOf(extension) > -1)) {
          this.selectedFiles = files = null;
          this.message = 'Niewłaściwy format pliku, wymagane:' + requiredTypes;
          return false;
        }
      }
    }
    this.message = '';
    return true;
  }
}

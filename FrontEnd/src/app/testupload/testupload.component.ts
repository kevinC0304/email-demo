import { Component, ViewChild } from '@angular/core';
import { detach } from '@syncfusion/ej2-base';
import { UploaderComponent, FileInfo, SelectedEventArgs } from '@syncfusion/ej2-angular-inputs';

/**
 * Uploader Custom Template sample
 */
@Component({
  selector: 'app-testupload',
  template: `<div id='dropArea'><span id='drop' class="droparea"> Drop files here or <a href="" id='browse'><u>Browse</u></a> </span>
    <ejs-uploader #defaultupload autoUpload='false'  [asyncSettings]='path' (selected)="onSelect($event)" (failure)="onuploadFailed($event)" (progress)="onFileUpload($event)" (success)="onuploadSuccess($event)">
    <ng-template #template let-data="">
          <span class='wrapper'><span class='icon sf-icon-{{data.type}}'></span>
          <span class='name file-name'>{{data.name}}</span></span>
          <span class='file-size-td file-size'>{{data.size}} bytes</span>
          <span class='e-icons e-file-remove-btn' title='Remove'></span> <br/>
          <progress id='progressBar' class='progressbar' value='0' max='100'></progress>
          <span class='percent-td percent'></span>
      </ng-template>
</ejs-uploader>
    </div> `
})
export class TestuploadComponent {
  @ViewChild('defaultupload')
  public uploadObj: UploaderComponent;
  public path: Object = {
    saveUrl: 'http://localhost:63056/api/values/Upload',
    removeUrl: 'http://localhost:63056/api/values/Remove'
  };
  constructor() {
  }
  ngAfterViewInit() {
    document.getElementById('browse').onclick = function () {
      document.getElementsByClassName('e-file-select-wrap')[0].querySelector('button').click();
      return false;
    }
    document.getElementById('dropArea').onclick = (e: any) => {
      let target: HTMLElement = <HTMLElement>e.target;
      if (target.classList.contains('e-file-delete-btn')) {
        for (let i: number = 0; i < this.uploadObj.getFilesData().length; i++) {
          if (target.closest('li').getAttribute('data-file-name') === this.uploadObj.getFilesData()[i].name) {
            this.uploadObj.remove(this.uploadObj.getFilesData()[i]);
          }
        }
      }
      else if (target.classList.contains('e-file-remove-btn')) {
        detach(target.closest('li'));
      }
    }
  }
  public parentElement: HTMLElement;
  public progressbarContainer: HTMLElement;
  public filesDetails: FileInfo[] = [];
  public filesList: HTMLElement[] = [];
  public dropElement: HTMLElement = document.getElementsByClassName('control-fluid')[0] as HTMLElement;

  public onFileUpload(args: any) {
    let li: HTMLElement = this.uploadObj.tagObjects.querySelector('[data-file-name="' + args.file.name + '"]');
    let progressValue: number = Math.round((args.e.loaded / args.e.total) * 100);
    li.getElementsByTagName('progress')[0].value = progressValue;
    li.getElementsByClassName('percent')[0].textContent = progressValue.toString() + " %";
  }
  public onuploadSuccess(args: any) {
    if (args.operation === 'remove') {
      let height: string = document.getElementById('dropArea').style.height;
      height = (parseInt(height) - 40) + 'px';
      document.getElementById('dropArea').style.height = height;
    } else {
      let li: HTMLElement = this.uploadObj.tagObjects.querySelector('[data-file-name="' + args.file.name + '"]');
      let progressBar: HTMLElement = li.getElementsByTagName('progress')[0];
      progressBar.classList.add('e-upload-success');
      li.getElementsByClassName('percent')[0].classList.add('e-upload-success');
      let height: string = document.getElementById('dropArea').style.height;
      document.getElementById('dropArea').style.height = parseInt(height) - 15 + 'px';
    }
  }
  public onuploadFailed(args: any) {
    let li: HTMLElement = this.uploadObj.tagObjects.querySelector('[data-file-name="' + args.file.name + '"]');
    let progressBar: HTMLElement = li.getElementsByTagName('progress')[0];
    progressBar.classList.add('e-upload-failed');
    li.getElementsByClassName('percent')[0].classList.add('e-upload-failed');
  }
  public onSelect(args: SelectedEventArgs) {
    let length: number = args.filesData.length;
    let height: string = document.getElementById('dropArea').style.height;
    height = parseInt(height) + (length * 55) + 'px';
    document.getElementById('dropArea').style.height = height;
  }
}
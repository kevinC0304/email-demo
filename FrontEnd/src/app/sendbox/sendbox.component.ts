import { Component, OnInit, ViewChild, ElementRef, HostListener, ChangeDetectorRef } from '@angular/core';
import { ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService, RichTextEditorComponent, ImageSettingsModel } from '@syncfusion/ej2-angular-richtexteditor';
import { SpinSettingsModel, ProgressButtonComponent } from '@syncfusion/ej2-angular-splitbuttons';
import { UploaderComponent } from '@syncfusion/ej2-angular-inputs';
import { HttpEventType } from '@angular/common/http';
import { email } from './email';
import { SendserviceService } from './sendservice.service';
import { DialogComponent, DialogUtility } from '@syncfusion/ej2-angular-popups';
import { EmitType } from '@syncfusion/ej2-base';
import { ButtonComponent } from '@syncfusion/ej2-angular-buttons';
@Component({
  selector: 'app-sendbox',
  templateUrl: './sendbox.component.html',
  styleUrls: ['./sendbox.component.scss'],
  providers: [ToolbarService, LinkService, ImageService, HtmlEditorService, QuickToolbarService]
})
export class SendboxComponent implements OnInit {

  public tools: object = {
    type: 'MultiRow',
    items: ['Undo', 'Redo', '|',
      'Bold', 'Italic', 'Underline', 'StrikeThrough', '|',
      'FontName', 'FontSize', 'FontColor', 'BackgroundColor', '|',
      'SubScript', 'SuperScript', '|',
      'LowerCase', 'UpperCase', '|',
      'Formats', 'Alignments', '|', 'OrderedList', 'UnorderedList', '|',
      'Indent', 'Outdent', '|', 'CreateLink',
      'Image', '|', 'ClearFormat', 'Print', 'SourceCode', '|', 'FullScreen']
  };
  public fontFamily: Object = { default: "Arial", width: "65px", items: [{ text: "Segoe UI", value: "Segoe UI" }, { text: "Arial", value: "Arial,Helvetica,sans-serif" }, { text: "Courier New", value: "Courier New,Courier,monospace" }, { text: "Georgia", value: "Georgia,serif" }, { text: "Impact", value: "Impact,Charcoal,sans-serif" }, { text: "Lucida Console", value: "Lucida Console,Monaco,monospace" }, { text: "Tahoma", value: "Tahoma,Geneva,sans-serif" }, { text: "Times New Roman", value: "Times New Roman,Times,serif" }, { text: "Trebuchet MS", value: "Trebuchet MS,Helvetica,sans-serif" }, { text: "Verdana", value: "Verdana,Geneva,sans-serif" }] };
  public quickTools: object = {
    image: [
      'Replace', 'Align', 'Caption', 'Remove', 'InsertLink', '-', 'Display', 'AltText', 'Dimension']
  };
  public insertImageSettings: ImageSettingsModel = { saveFormat: 'Base64' }

  public buttons: Object = {
    browse: 'Attachments'
  };
  public signature: string = "<div><p><br></p><p>Best Regards</p><p>Kevin Cao</p><p>Developer</p><p>Ebix Australia  kevin.cao@ebix.com.au | Web <a classname='e-rte-anchor' href='www.ebix.com.au' title='www.ebix.com.au'>www.ebix.com.au </a></p></div>";
  public path: Object = {
    saveUrl: 'http://localhost:63056/api/values/Upload'
  };
  public preLoadFiles: Object[] = [
    { name: 'Capture', size: 20685, type: '.JPG' }
  ]
  public toValue: string = "";
  public CcValue: string = "";
  public BccValue: string = "";
  public subjectValue: string = "";

  private spinSettings: SpinSettingsModel = { position: 'Right', width: 20, template: '<div class="template"></div>' };
  @ViewChild('textbox') textbox: RichTextEditorComponent

  @ViewChild('defaultupload') uploadObj: UploaderComponent;
  @ViewChild('ejDialog') ejDialog: DialogComponent;
  // @ViewChild('sendButton') sendButton:ProgressButtonComponent;
  @ViewChild('togglebtn') togglebtn: ButtonComponent;


  constructor(private emailService: SendserviceService,private cd: ChangeDetectorRef) {

    // this.ejDialog.hide();
  }

  ngOnInit() {
    // this.initilaizeTarget();
    // this.ejDialog.hide();
  }
  //  initilaizeTarget: EmitType<object> = () => {
  //     this.targetElement = this.container.nativeElement.parentElement;
  //   }
  public onOverlayClick: EmitType<object> = () => {
    this.ejDialog.hide();
  }
  // @HostListener('click', ['togglebtn']) btnClick() {
  //   if(this.togglebtn.element.classList.contains('e-active')){
  //       this.togglebtn.content = 'Sending';
  //       this.togglebtn.iconCss = 'e-btn-sb-icon';
  //   }
  //   else {
  //       if(this.togglebtn.content === 'Sending'){
  //         this.togglebtn.content = 'Sent';
  //         this.togglebtn.iconCss = 'e-btn-sb-icon';
  //       }
  //   }
  // }

  ngAfterViewInit() {
    this.cd.detectChanges();
    let box1: any[] = this.uploadObj.fileList;
    for (var i = 0; i < box1.length; i++) {
      var fileObj = (<HTMLInputElement>box1[i]);

      let progressBar: HTMLElement = fileObj.getElementsByTagName('progress')[0];
      progressBar.classList.add('e-upload-success');
      fileObj.getElementsByClassName('percent')[0].classList.add('e-upload-success');

    }
    this.textbox.value=this.signature;
  }

  openFile(name) {
    this.emailService.downloadFile(name).subscribe(
      data => {

        console.log(data);
        switch (data.type) {
          case HttpEventType.DownloadProgress:
            break;
          case HttpEventType.Response:
            const downloadedFile = new Blob([data.body], { type: data.body.type });
            let url = window.URL.createObjectURL(downloadedFile);
            let pwa = window.open(url);
            break;
        }
      },
      error => {

      }
    );

  }



  removeFile(name) {

    for (let i: number = 0; i < this.uploadObj.getFilesData().length; i++) {
      if (name === this.uploadObj.getFilesData()[i].name) {
        this.uploadObj.remove(this.uploadObj.getFilesData()[i]);
      }
    }

  }
  send() {

    if (this.toValue === "" && this.CcValue === "" && this.BccValue === "") {
  
      this.ejDialog.content = "Please specify at least one recipient";
      this.ejDialog.show();
      this.togglebtn.isToggle = false;

    } else {

      // this.sendButton.enableProgress=true;
      // this.sendButton.enablePersistence=true;
      if (this.togglebtn.content === 'Send') {
        this.togglebtn.content = 'Sending';
        this.togglebtn.disabled = true;
      }

      let email: email = {
        to: this.toValue,
        cc: this.CcValue,
        bcc: this.BccValue,
        subject: this.subjectValue,
        body: this.textbox.getRootElement().querySelector("#defaultRTE_rte-edit-view").outerHTML,
        attachments: this.uploadObj.filesData.map(a => a.name)
      }
      this.emailService.sendEmail(email).subscribe(
        result => {

          if (this.togglebtn.content === 'Sending') {
            this.togglebtn.content = 'Send';
            this.togglebtn.disabled = false;
          }
          this.ejDialog.content = "Sent successfully";
          this.ejDialog.show();
        },

        error => {

          if (this.togglebtn.content === 'Sending') {
            this.togglebtn.content = 'Send';
            this.togglebtn.disabled = false;
          }

          this.ejDialog.content = "Sent failed";
          this.ejDialog.show();
          console.log(error);
        }

      )
      // console.log(email);
    }


  }
  public onFileUpload(args: any) {

    let box1: any[] = this.uploadObj.fileList;
    for (var i = 0; i < box1.length; i++) {
      var fileObj = (<HTMLInputElement>box1[i]);
      if (fileObj.innerText === args.file.name) {
        let progressValue: number = Math.round((args.e.loaded / args.e.total) * 100);
        fileObj.getElementsByTagName('progress')[0].value = progressValue;
        fileObj.getElementsByClassName('percent')[0].textContent = progressValue.toString() + " %";
      }
    }

  }
  public onuploadSuccess(args: any) {

    let box1: any[] = this.uploadObj.fileList;
    for (var i = 0; i < box1.length; i++) {
      var fileObj = (<HTMLInputElement>box1[i]);
      if (fileObj.childNodes[0].textContent === args.file.name) {

        let progressBar: HTMLElement = fileObj.getElementsByTagName('progress')[0];
        progressBar.classList.add('e-upload-success');
        fileObj.getElementsByClassName('percent')[0].classList.add('e-upload-success');
      }
    }

  }
  public onuploadFailed(args: any) {
    let li: HTMLElement = this.uploadObj.tagObjects.querySelector('[data-file-name="' + args.file.name + '"]');
    let progressBar: HTMLElement = li.getElementsByTagName('progress')[0];
    progressBar.classList.add('e-upload-failed');
    li.getElementsByClassName('percent')[0].classList.add('e-upload-failed');
  }
}

import {Component, OnInit} from '@angular/core';
import {TextStorageService} from '../services/text-storage.service';
import {Clipboard} from '@awesome-cordova-plugins/clipboard/ngx';
import {Router} from '@angular/router';

@Component({
  selector: 'app-text-view',
  templateUrl: './text-view.component.html',
  styleUrls: ['./text-view.component.scss'],
})
export class TextViewComponent implements OnInit {

  textToDisplay = '';

  constructor(private service: TextStorageService, private clipboard: Clipboard, private router: Router) {
  }

  ngOnInit() {
    this.textToDisplay = this.service.getStoredText();
  }

  refresh() {
    this.textToDisplay = this.service.getStoredText();
  }

  copy() {
    this.clipboard.copy(this.textToDisplay);
  }

}

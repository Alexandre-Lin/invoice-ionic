import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import * as moment from 'moment';
import {StorageServiceService} from '../services/storage-service.service';
import {Invoice} from '../shared/model/invoice';

@Component({
  selector: 'app-preview-print',
  templateUrl: './preview-print.component.html',
  styleUrls: ['./preview-print.component.scss'],
})
export class PreviewPrintComponent implements OnInit {

  // current stored invoice id
  currentKey: string;

  // current invoice to display
  currentInvoice: Invoice = {
    date: null,
    productList: [],
    total: null,
    tax: null,
    paymentMode: null,
    customerAdress: null,
    customerName: null
  };

  // loading boolean
  isLoaded = false;

  constructor(private route: ActivatedRoute,
              private storageService: StorageServiceService,
              private translateService: TranslateService) {
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.isLoaded = false;
      this.currentKey = params.key;
      this.storageService.getFromKey(this.currentKey).then(invoice => {
        this.currentInvoice = JSON.parse(invoice);
        this.currentInvoice.date = moment(this.currentInvoice.date);
        this.convertPaymentModeLabel();
        this.isLoaded = true;
      });
    });
  }

  // change label of payment mode for printing
  convertPaymentModeLabel(): void {
    this.currentInvoice.paymentMode = this.translateService.instant(this.currentInvoice.paymentMode);
  }
}

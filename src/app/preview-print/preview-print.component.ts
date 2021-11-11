import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StorageServiceService } from '../services/storage-service.service';
import { Invoice } from '../shared/model/invoice';
import { Tab1Page } from '../tab1/tab1.page';

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
    paymentMode: null
  }

  constructor(private route: ActivatedRoute,
    private storageService: StorageServiceService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.currentKey = params["key"];
      this.storageService.getFromKey(this.currentKey).then(invoice => { this.currentInvoice = invoice; console.log(this.currentInvoice);});
    })
  }
}

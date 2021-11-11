import { AfterContentChecked, AfterContentInit, Component, OnInit } from '@angular/core';
import { StorageServiceService } from '../services/storage-service.service';
import { InvoiceItem } from '../shared/model/invoice-item';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit {

  invoices: InvoiceItem[] = [];

  constructor(private storageService: StorageServiceService) {}

  ngOnInit(): void {
    this.storageService.observeChanges().subscribe(() => {
      this.storageService.getAllInvoices().then(invoices => {this.invoices = invoices;});
    });
  }
}

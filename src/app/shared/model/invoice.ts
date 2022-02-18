import {Product} from './product';

import {Moment} from 'moment';

export interface Invoice {
  invoiceNumber: number;
  companyName: string;
  companyAddress: string;
  date: Moment;
  productList: Product[];
  // tax percentage (not the tax charge amount)
  tax: number;
  total: number;
  paymentMode: string;
  customerName: string;
  customerAdress: string;
}

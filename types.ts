
export interface RFQ {
  projectName: string;
  items: string;
  file?: File;
  logo?: File;
}

export interface Supplier {
  name: string;
  website: string;
  location: string;
  leadTime: string;
  paymentMethods: string[];
}

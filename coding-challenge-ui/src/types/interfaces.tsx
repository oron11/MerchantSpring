
export interface User {
    firstName: string;
    lastName: string;
    email: string;
    id: number;
}

export interface Marketplace {
    countryFlagCode: string;
    name: string;
}

  export interface DisplayOrder {
    Id: string;
    marketplace: Marketplace | undefined,
    shopName: string;
    orderId: string;
    orderValue: number;
    destination: string;
    items: number;
    overdue_days: number,
  }
  
  export interface DataOrder {
    Id: string;
    storeId: number;
    orderId: string;
    overdue_days: number,
    destination: string;
    items: number;
    orderValue: number;
  }
  
  export interface Store {
    storeId: number;
    marketplace: string;
    country: string;
    shopName: string;
  }
  
  export interface Sales {
    orders: DataOrder[];
    stores: Store[];
  }
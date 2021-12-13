import { parseFile } from 'fast-csv';
import path from "path";
import moment from "moment";

enum ShipmentStatus {
    Pending,
    Shipped
}

interface Order {
    id: number;
    storeId: number;
    orderId: string;
    latest_ship_date?: string,
    overdue_days: number,
    shipment_status?: string,
    destination: string;
    items: number;
    orderValue: number;
}

interface Store {
    storeId: number;
    marketplace: string;
    country: string;
    shopName: string;
}

const DATA_DIR_FILE_PATH = path.join(__dirname, ".." , "data");
const ORDERS_FILE_PATH = path.join(DATA_DIR_FILE_PATH, "orders.csv");
const STORES_FILE_PATH = path.join(DATA_DIR_FILE_PATH, "stores.csv");

const MS_PER_DAY = (1000 * 60 * 60 * 24);

function dateDiff(date1: Date, date2: Date) : number {
    const diff = date1.getTime() - date2.getTime(); 
    
    return Math.floor(diff / MS_PER_DAY); 
}

function isOrderOnPendingStatus(shipment_status: string | undefined) : boolean {
    return (shipment_status == ShipmentStatus[ShipmentStatus.Pending]);
}

  /* Add order that is on pending state and the shipment date is overdue */
function addMatchingOrder(rawOrder: object, orders: Order[], currentDate: Date) {
    let order = rawOrder as Order;
    
    console.debug("Current raw order", rawOrder, ", order", order, "\n");
    if (!isOrderOnPendingStatus(order.shipment_status)) {
        console.log("Order is not on pending status, status is", order.shipment_status);
        return;
    }

    order.shipment_status = undefined;

    if (!order.latest_ship_date) {
        console.log("Order does not have latest_ship_date");
        return;
    }

    const latest_ship_date = moment.parseZone(order.latest_ship_date, "DD/MM/YYYY").toDate(); 
    console.debug ("latest_ship_date ,", latest_ship_date, ", order.latest_ship_date", order.latest_ship_date);
    if (currentDate < latest_ship_date) {
        console.log("Order is not overdue:", order, ", current date", currentDate);
        return;
    }

    order.overdue_days = dateDiff(currentDate, latest_ship_date);
    order.latest_ship_date = undefined;

    orders.push(order);
}

function getOrdersFromCsvFile() : Promise<Order[]> {
    return new Promise((resolve, reject) => {
        const currentDate = new Date();
        let orders: Order[] = [];

        parseFile(ORDERS_FILE_PATH, { headers: true  })
        .on('error', error => reject(error))
        .on('data', row =>  { 
            addMatchingOrder(row, orders, currentDate);
        })
        .on('end', (rowCount: number) =>  {
            console.log(`Parsed ${rowCount} rows`);
            resolve(orders)
        });
    })
}

function addStore(rawStore: object, stores: Store[]) {
    stores.push(rawStore as Store);
}

function getStoresFromCsvFile() : Promise<Store[]>{
    return new Promise((resolve, reject) => {
        let stores: Store[] = [];

        parseFile(STORES_FILE_PATH, { headers: true })
        .on('error', error => reject(error))
        .on('data', row =>  { 
            addStore(row, stores);
        })
        .on('end', (rowCount: number) =>  {
            console.log(`Parsed ${rowCount} rows`);
            resolve(stores)
        });
    })
}

export interface Sales {
    orders: Order[];
    stores: Store[];
}

export async function getSales() : Promise<Sales> {
     const [orders, stores] = await Promise.all([
        getOrdersFromCsvFile(),
        getStoresFromCsvFile()
    ]);

    let sales : Sales = { orders: orders, stores: stores };

    console.debug("All sales result:", sales);
    
    return sales;
}


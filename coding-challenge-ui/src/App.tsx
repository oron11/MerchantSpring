import React, { useState, useMemo } from "react";
import { hasFlag } from 'country-flag-icons'

import styled from "styled-components";
import Widget from "./components/Widget";
import { User, Sales, DataOrder, DisplayOrder, Store, Marketplace } from './types/interfaces';
import DisplayMarketplace from './components/MarketplaceDisplay';

const AppWrapper = styled.div`
  height: 100vh;
  width: 100vw;
  min-width: 1000px;
  min-height: 600px;
  background-color: #cccccc;
  display: flex;
  flex-direction: column;
`;

const AppHeader = styled.header`
  background-color: white;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0rem 2rem;
`;

const Buffer = styled.div`
height: 10vh;
`;

const HeaderText = styled.h1`
  font-family: "Roboto", sans-serif;
`;

const Username = styled.span`
  font-family: "Roboto", sans-serif;
`;

const SERVER_ADDR = "http://localhost:8080/";
const NOT_APPLICABLE_STRING_DISPLAY = "N/A";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [sales, setSales] = useState<Sales | null>(null); 
  const [displayOrders, setDisplayOrders] = useState<DisplayOrder[]>([]);

 const TITLE = "Overdue Orders";

 const columns = useMemo(
  () => [
    {
      Header: 'MARKETPLACE',
      accessor: 'marketplace.name',
      disableSortBy: true,
      Cell: ({ row: { original: { marketplace } } } : any) => {
        return (
          <DisplayMarketplace marketplace={marketplace} />
        );
      }
    },
    {
      Header: 'STORE',
      accessor: 'shopName',
      disableSortBy: true
    },
    {
      Header: 'ORDER ID',
      accessor: 'orderId',
      disableSortBy: true
    },
    {
      Header: 'ORDER VALUE',
      accessor: 'orderValue',
      disableSortBy: true
    },
    {
      Header: 'ITEMS',
      accessor: 'items',
      disableSortBy: true
    },
    {
      Header: 'DESTINATION',
      accessor: 'destination',
      disableSortBy: true
    },
    {
      Header: 'DAYS OVERDUE',
      accessor: 'overdue_days',
    },
  ],
  []
);

  const getStore = (storeId: number, stores: Store[]) : Store | undefined => {
    const found = stores.find(store => store.storeId === storeId);

    if (!found) {
      console.error("No matching store name was found for", storeId);
    }

    return found;
  }

  const getCountryFlagCode = (country: string) : string => {
   // const found = array1.find(element => element > 10);
   const shortenCountry = country.substr(0, 2);
   
   if (hasFlag(shortenCountry)) {
     console.log("flag ", country);
     return shortenCountry;
   }
   else {
    console.log("No matching flag for", country);
    return "US";
   }
  }

  type StoreOrderDetails = {
    marketplace: Marketplace;
    shopName : string;
  }

  const getStoreDetails = (storeId: number, stores: Store[]) : StoreOrderDetails | undefined => {
    const store = getStore(storeId, stores);

    if (!store) {
      return undefined;
    }

   const storeOrderDetails : StoreOrderDetails = {
      shopName: store.shopName,
      marketplace: { name: store.marketplace, countryFlagCode: getCountryFlagCode(store.country) }
    }

    return storeOrderDetails;
  }

  const fetchDataFromServer = async (req: string, cb: React.SetStateAction<any>) => {
    fetch(SERVER_ADDR + req)
      .then((results) => results.json())
      .then((data) => {
        cb(data);
        console.log("Data received from server", data);
      })
      .catch(err => {
        console.error(err);
      })
  }

  React.useEffect(() => {
    const populateDisplayOrders = (dataOrders : DataOrder[], stores: Store[]) => {
      let displayOrders : DisplayOrder[] = [];
  
      for (const dataOrder of dataOrders) {
        const storeOrderDetails = getStoreDetails(dataOrder.storeId, stores);
        let displayOrder : DisplayOrder = {
          Id: dataOrder.Id,
          marketplace: storeOrderDetails?.marketplace,
          shopName: storeOrderDetails?.shopName || NOT_APPLICABLE_STRING_DISPLAY,
          orderId: dataOrder.orderId,
          destination: dataOrder.destination,
          orderValue: dataOrder.orderValue,
          items: dataOrder.items,
          overdue_days: dataOrder.overdue_days
        };
  
        displayOrders.push(displayOrder);
      }
  
      console.log("Display orders", displayOrders);
  
      setDisplayOrders(displayOrders);
    }

    if (sales) {
      populateDisplayOrders(sales.orders, sales.stores);
    }
  }, [sales]);

  React.useEffect(() => {
    const fetchData = () => {
      fetchDataFromServer("user", setUser);
      fetchDataFromServer("sales", setSales);
    }
    
    fetchData();
  }, []);

  return (
    <AppWrapper>
      <AppHeader>
        <HeaderText>Analytics Dashboard</HeaderText>
        <Username>Welcome, {user ? user.firstName : "Guest"}!</Username>
      </AppHeader>
      
      <Buffer />
      {/** Dashboard - new widgets go here */}
       {displayOrders?.length > 0 ? <Widget displayOrders={displayOrders} titleText={TITLE} columns={columns}/> : null }
       <Buffer />
    </AppWrapper>
  );
};

export default App;

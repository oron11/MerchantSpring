
import React, {  } from "react";
import styled from "styled-components";
import Flags from 'country-flag-icons/react/3x2'

const DisplayMarketplace = ( { marketplace } : any) => {
    const Div = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    `;

    const P = styled.p`
      margin-left: 12%
    `;

   const flagStyle = { width: 30, height: 20, display: 'flex', 'margin-left': '5%'} ;
    return (
      <Div> 
          { marketplace.countryFlagCode === "US" ? 
             <Flags.US style={flagStyle} /> : 
             marketplace.countryFlagCode === "AU" ? 
             <Flags.AU style={flagStyle}/> : 
             marketplace.countryFlagCode === "GB" ? 
             <Flags.GB style={flagStyle}/> :
             <Flags.IL style={flagStyle}/> 
          }
        <P>{marketplace.name}</P>
      </Div>
    )
}

export default DisplayMarketplace;
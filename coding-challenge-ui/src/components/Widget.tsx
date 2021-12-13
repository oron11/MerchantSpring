import React, {  } from "react";
import { useTable, useSortBy, usePagination, HeaderGroup } from "react-table";
import { VscArrowSmallUp, VscArrowSmallDown } from 'react-icons/vsc';
import { BsArrowDownUp, BsArrowDown, BsArrowUp} from 'react-icons/bs';
import Title from './Title';
import { DisplayOrder } from '../types/interfaces';
import { Table, Thead, TR, WidgetWrapper, TD, PagingWrapper } from "../style/widgetStyle";

type WidgetProps = {
    titleText: string,
    displayOrders: DisplayOrder [],
    columns: any[]
}

const Widget = ({ titleText, displayOrders, columns} : WidgetProps ) => {
    const {
        getTableProps, // table props from react-table
        getTableBodyProps, // table body props from react-table
        headerGroups, // headerGroups, if your table has groupings
      //  rows, // rows for the table based on the data passed
        prepareRow,// Prepare the row (this function needs to be called for each row before getting the row props)
        page, // Instead of using 'rows', we'll use page,
        // which has only the rows for the active page
    
        // The rest of these things are super handy, too ;)
        canPreviousPage,
        canNextPage,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        state: { pageIndex }
      } = useTable({
        columns,
        data: displayOrders,
        initialState: { pageIndex: 0, pageSize: 5 },
      }, 
      useSortBy,
      usePagination
      );

      const renderSortingIcon = (column : HeaderGroup<DisplayOrder>) => {
        const iconStyle = { marginLeft: '5px' };
        const iconSize = 15;

        if (!column.canSort) {
            return "";
        }
        else if (!column.isSorted) {
            return <BsArrowDownUp size={iconSize} style={iconStyle}/>;
        }
        else if (column.isSortedDesc) {
            return <BsArrowDown size={iconSize} style={iconStyle}/>
        }
        else {
            return <BsArrowUp size={iconSize} style={iconStyle}/>
        }
      }

      const pagingButtonStyle = { 
        border: 'none',
        backgroundColor: 'transparent'
      }

      const renderNextPageNumber = () => {
        if ((pageIndex + 1) < pageCount) {
          return <span>{pageIndex + 2} </span>
        }
        else {
          return <span>{' '}</span>
        }
      }

      const renderPrevPageNumber = () => {
        if (pageIndex > 0) {
          return <span>{pageIndex} </span>
        }
        else {
          return <span>{' '}</span>
        }
      }

    return (
    <WidgetWrapper>
    <Title text={titleText}/>
    <Table {...getTableProps()}  className="table table-striped">
      <Thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps(column.getSortByToggleProps())}>{column.render("Header")}
                  {/* Add a sort direction indicator */}
                
                    {renderSortingIcon(column)}
                
              </th>
            ))}
          </tr>
        ))}
      </Thead>
      <tbody {...getTableBodyProps()}>
        {page.map((row, i) => {
          prepareRow(row);
          return (
            <TR {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <TD {...cell.getCellProps()}>{cell.render("Cell")}</TD>;
              })}
            </TR>
          );
        })}
      </tbody>
    </Table>

      <br />
      <PagingWrapper>
        <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} style={pagingButtonStyle}>
          {'<<'}
        </button>&nbsp;
        <button onClick={() => previousPage()} disabled={!canPreviousPage} style={pagingButtonStyle}>
          {'<'}
        </button>&nbsp;
        {renderPrevPageNumber()}
        <span>&nbsp;
          Page 
        </span>&nbsp;
        <input
            type="number"
            value={pageIndex + 1}
            readOnly={true}
            style={{ width: '3vh', textAlign: 'center' }}
        />&nbsp;
        { renderNextPageNumber()}&nbsp;
       
        <button onClick={() => nextPage()} disabled={!canNextPage} style={pagingButtonStyle}>
          {'>'}
        </button>&nbsp;
        <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} style={pagingButtonStyle}>
          {'>>'}
        </button>
      </PagingWrapper>
    </WidgetWrapper>
    )
}

export default Widget;
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState, useEffect } from "react";
import DebouncedInput from "./DebouncedInput";
import { CiSearch } from "react-icons/ci";
import styles from "../../../styles/table.module.css";
import ActionsDropdown from "./ActionDropdown";
import { useFetchTransactions } from "../../../api/apiFolder/tableApi";
import { useSelector } from "../../../api/hook";



const TanStackTable = () => {
  const { AllTransactions } = useFetchTransactions();
  const [categoryColors, setCategoryColors] = useState({});

  const generateRandomColor = () => {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const getColorForCategory = (category) => {
    if (!categoryColors[category]) {
      const newColor = generateRandomColor();
      setCategoryColors((prevColors) => ({
        ...prevColors,
        [category]: newColor,
      }));
      return newColor;
    }
    return categoryColors[category];
  };
  const columnHelper = createColumnHelper();
  const userId = useSelector((state) => state.auth.user?.id);
const columns = [
  columnHelper.accessor("transaction_date", {
    header: "Date",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  
  columnHelper.accessor("description", {
    header: "Description",
    cell: (info) => <span>{info.getValue()}</span>,
  }),
  columnHelper.accessor("amount", {
    header: "Amount",
    cell: (info) => {
      const value = info.getValue();
      const amount = parseFloat(value);
      return <span>₦{isNaN(amount) ? '0.00' : amount.toFixed(2)}</span>; // Default to '0.00' if NaN
    },
  }),
  // columnHelper.accessor("category", {
  //   header: "Category",
  //   cell: (info) => {
  //     const category = info.getValue();
  //     return (
  //       <span
  //         className={styles.categoryCell}
  //         style={{
  //           backgroundColor: categoryColors[category] || '#ccc', 
  //         }}
  //       >
  //         {category}
  //       </span>
  //     );
  //   },
  // }),
  columnHelper.accessor("category", {
    header: "Category",
    cell: (info) => {
      const category = info.getValue();
      const color = getColorForCategory(category);
      return (
        <span
          className={styles.categoryCell}
          style={{
            backgroundColor: color,
          }}
        >
          {category}
        </span>
      );
    },
  }),
  columnHelper.accessor("actions", {
    header: "Actions",
    cell: (info) => (
      <ActionsDropdown
        onView={() => handleView(info.row.original)}
        onDelete={() => handleDelete(info.row.original)}
      />
    ),
  }),
];

const [data, setData] = useState([]);
const [globalFilter, setGlobalFilter] = useState("");


  const getData = async () => {
    try {
      const transactions = await AllTransactions(); 
      setData(transactions); 
    } catch (error) {
      console.error("Failed to fetch transactions", error);
    }
  };
  useEffect(() => {
  getData();
}, []);

const table = useReactTable({
  data,
  columns,
  state: {
    globalFilter,
  },
  getFilteredRowModel: getFilteredRowModel(),
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});



const handleView = (transaction) => {
  console.log('View transaction:', transaction);
};

const handleDelete = (transactionId) => {
  setData(prevData => prevData.filter(transaction => transaction.transactionId !== transactionId));
};
return (
  <div style={{width:"100%"}}>
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.searchContainer}>
          {/* <CiSearch /> */}
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
          />
        </div>
      </div>
      <div className={styles.wrapper}>
        <table className={styles.table}>
          <thead className={styles.tableLower}>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className={styles.headerContainer}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.tableHeaderCell}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row, i) => (
                <tr
                  key={row.id}
                  className={
                    i % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={styles.tableCell}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr className={styles.noRecordRow}>
                <td colSpan={columns.length}>No Record Found!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    {/* pagination */}
    <div className={styles.paginationContainer}>
      <button
        onClick={() => {
          table.previousPage();
        }}
        disabled={!table.getCanPreviousPage()}
        className={styles.paginationButton}
      >
        {"<"}
      </button>
      <button
        onClick={() => {
          table.nextPage();
        }}
        disabled={!table.getCanNextPage()}
        className={styles.paginationButton}
      >
        {">"}
      </button>
      <span className={styles.pageInfo}>
        <div>Page</div>
        <strong>
          {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </strong>
      </span>
      <span className={styles.goToPageContainer}>
        | Go to page:
        <input
          type="number"
          defaultValue={table.getState().pagination.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            table.setPageIndex(page);
          }}
          className={styles.pageInput}
        />
      </span>
      <select
        value={table.getState().pagination.pageSize}
        onChange={(e) => {
          table.setPageSize(Number(e.target.value));
        }}
        className={styles.pageSizeSelect}
      >
        {[10, 20, 30, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select>
    </div>
  </div>
);
};

export default TanStackTable;
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { TableVirtuoso } from 'react-virtuoso';
import { Box, MenuItem, TextField } from '@mui/material';

const VirtuosoTableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    <Table {...props} sx={{ borderCollapse: 'separate', tableLayout: 'fixed' }} />
  ),
  TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
  TableRow,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};


const TableComponent = ({ columns, rows, rowContent }) => {
  const [selectedStatusFilter, setSelectedStatusFilter] = React.useState("all")
  const [filteredData, setFilteredData] = React.useState(rows)
 
  React.useEffect(() => {
    if (selectedStatusFilter === "all") {
      setFilteredData(rows);
      
    }else{
      setFilteredData(rows.filter(item=>item.status===selectedStatusFilter));
      
    }
  }, [selectedStatusFilter,rows])

  function fixedHeaderContent() {
    return (
      <TableRow>
        {columns.map((column) => {
          if (column.dataKey === "status") {
            return (
              <TableCell
                key={column.dataKey}
                variant="head"
                align="center"
                // align={column.numeric || false ? 'right' : 'left'}
                style={{ width: column.width }}
                sx={{ backgroundColor: 'background.paper', color: "#1976d2", fontWeight: "bold" }}
              >
                {/* {column.label} */}
                <TextField
                  select
                  name={"flow_type"}
                  value={selectedStatusFilter}
                  onChange={(e) =>  setSelectedStatusFilter(e.target.value)}
                >
                  <MenuItem value={"all"}>All Status</MenuItem>
                  <MenuItem value={"active"}>Active</MenuItem>
                  <MenuItem value={"deactive"}>Deactive</MenuItem>
                </TextField>
              </TableCell>
            )
          } else {
            return (<TableCell
              key={column.dataKey}
              variant="head"
              align="center"
              // align={column.numeric || false ? 'right' : 'left'}
              style={{ width: column.width }}
              sx={{ backgroundColor: 'background.paper', color: "#1976d2", fontWeight: "bold" }}
            >
              {column.label}
            </TableCell>)
          }
        }
        )}
      </TableRow>
    );
  }
  return (
    <Paper style={{ height: 450, width: '100%', marginBottom:100 }}>
      {rows.length === 0 ? (
        <Box style={{ textAlign: 'center', padding: '20px' }}>No Data Found</Box>
      ) : (
        <TableVirtuoso
          data={filteredData}
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
        />
      )}
    </Paper>
  );
};

export default TableComponent;

import { Button, Container, Paper, TableCell, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import TableComponent from '../../components/table/TableComponent';
import ConfirmationModal from '../../components/modals/ConfirmationModal';
import AddNewTitle from '../../components/table/AddNewTitle';
import TableSearchbar from '../../components/searchbar/TableSearchbar';
import BackButton from '../../components/buttons/BackButton';
import { useNavigate } from "react-router";
import fetchData from '../../api/fetchData';
import getApi from '../../api/getApi';
import statusUpdate from '../../api/statusUpdate';

const columns = [
  { width: 150, label: 'Name', dataKey: 'pos_name' },
  { width: 150, label: 'Mac Address', dataKey: 'mac_address' },
  { width: 80, label: 'Status', dataKey: 'status' },
  { width: 80, label: 'Action', dataKey: 'action' },
];

const PosConfigurationsTable = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [rows, setRows] = useState([]);
  const [filteredRows, setFilteredRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dataToSend, setDataTosend] = useState({});
  const [loading, setLoading] = useState(false);
  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchTerm(value);

    if (value) {
      const filteredData = rows.filter(row => (
        row.mac_address.toLowerCase().includes(value.toLowerCase()) ||
        row.pos_name.toLowerCase().includes(value.toLowerCase())
      )
      );
      setFilteredRows(filteredData);
    } else {
      setFilteredRows(rows); // If search term is empty, show all rows
    }
  };


  function rowContent(_index, row) {
    return columns.map((column) => {
      switch (column.dataKey) {
       
        case 'status':
          return (
            <TableCell key={column.dataKey} align="center">
              <Button
                variant="contained"
                color={row[column.dataKey] === 'active' ? 'primary' : 'error'}
                style={{ position: 'static', borderRadius: '20px' }}
                onClick={() => handleOpenModal(row._id, (row.status === "active" ? "deactive" : "active"), "status")}
              >
                {row[column.dataKey] === 'deactive' ? 'Deactive' : 'Active'}
              </Button>
            </TableCell>
          );
        case 'action':
          return (
            <TableCell key={column.dataKey} align="center">
              <Button
                style={{
                  position: 'static',
                  borderRadius: '20px',
                  border: '1px solid green',
                  color: 'green'
                }}
                onClick={() => navigate(`edit?id=${row._id}`)}
              >
                View
              </Button>
            </TableCell>
          );
        default:
          return (
            <TableCell key={column.dataKey} align="center">
              {row[column.dataKey]}
            </TableCell>
          );
      }
    });
  }

  const handleOpenModal = (_id, value, type) => {
    setDataTosend({});
    if (type === "status") {
      setDataTosend(prev => ({ ...prev, _id: _id, status: value }));
    }
    setModalOpen(true);
  };
  const handleCloseDialog = () => {
    setModalOpen(false);
  };
  const successHandler = () => {
    // fetchData(() => getApi('/posconfiguration'), setRows, "Unable to fetch posconfigurations", "Fetching posconfigurations");
    setRows(prev => {
      let updatedData = [...prev];

      updatedData.map(item => {
        if (item._id === dataToSend._id) {
          item.status = dataToSend.status;
        }
      })
      return updatedData;
    })
    handleCloseDialog();
  }
  useEffect(() => {
    fetchData(() => getApi('/posconfiguration'), setRows, "Unable to fetch pos configurations", "Fetching posconfigurations");
  }, []);

  useEffect(() => {
    setFilteredRows(rows); // Initialize filtered rows when `rows` change
  }, [rows]);

  return (
    <Container>
      <BackButton handleOnClick={() => navigate(-1)} />
      <Typography variant='h4' sx={{ textAlign: "center", color: "#1976d2", fontWeight: "bold" }}>
        POS CONFIGURATIONS
      </Typography>
      <TableSearchbar label={"Search Pos Configurations"} searchTerm={searchTerm} handleSearch={handleSearch} />
      <AddNewTitle title={"Add New Pos Configuration"} path={`add`} />
      <Paper>
        <TableComponent rows={filteredRows} columns={columns} rowContent={rowContent} />
      </Paper>
      <ConfirmationModal
        open={modalOpen}
        handleOnClose={handleCloseDialog}
        handleOnConfirm={() => statusUpdate({ title: "posconfiguration", dataToSend, successHandler, setLoading })}
        heading={"Update Pos Configuration status"}
        text={"Please confirm your action"}
      />
    </Container>
  );
}

export default PosConfigurationsTable;

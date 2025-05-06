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
import CONFIG from '../../config';

const columns = [
  { width: 150, label: 'Title', dataKey: 'title' },
  { width: 80, label: 'Status', dataKey: 'status' },
  { width: 80, label: 'Action', dataKey: 'action' },
];

const PolicyPagesTable = () => {

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
        row.title.toLowerCase().includes(value.toLowerCase())
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
        case 'cover':
          return (
            <TableCell key={column.dataKey} align="center">
              <img
                src={row[column.dataKey] ? `${CONFIG.imageURL}${row[column.dataKey]}` : ''}
                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                alt={row["name"] || 'No Image'}
              />
            </TableCell>
          );
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
    // fetchData(() => getApi('/policyPage'), setRows, "Unable to fetch policyPages", "Fetching policyPages");
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
    fetchData(() => getApi('/policypage'), setRows, "Unable to fetch policy pages", "Fetching policy pages");
  }, []);

  useEffect(() => {
    setFilteredRows(rows); // Initialize filtered rows when `rows` change
  }, [rows]);

  return (
    <Container>
      <BackButton handleOnClick={() => navigate(-1)} />
      <Typography variant='h4' sx={{ textAlign: "center", color: "#1976d2", fontWeight: "bold" }}>
        POLICY PAGE
      </Typography>
      <TableSearchbar label={"Search Policy Pages"} searchTerm={searchTerm} handleSearch={handleSearch} />
      <AddNewTitle title={"Add New Policy Page"} path={`add`} />
      <Paper>
        <TableComponent rows={filteredRows} columns={columns} rowContent={rowContent} />
      </Paper>
      <ConfirmationModal
        open={modalOpen}
        handleOnClose={handleCloseDialog}
        handleOnConfirm={() => statusUpdate({ title: "policypage", dataToSend, successHandler, setLoading })}
        heading={"Update Policy Page status"}
        text={"Please confirm your action"}
      />
    </Container>
  );
}

export default PolicyPagesTable;

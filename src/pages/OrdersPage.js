import { Helmet } from 'react-helmet-async';
import { filter } from 'lodash';
import { sentenceCase } from 'change-case';
import { useState } from 'react';
// @mui
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Checkbox,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';
// components
import Label from '../components/label';
import Scrollbar from '../components/scrollbar';
import Spinner from '../components/spinner/Spinner';
// sections
import { UserListHead, UserListToolbar } from '../sections/@dashboard/user';
// context
import { useOrders } from '../context/OrdersContext';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'customer', label: 'Customer', alignRight: false },
  { id: 'orderDate', label: 'Order Date', alignRight: false },
  { id: 'items', label: 'Ordered Items', alignRight: false },
  { id: 'total', label: 'Total Amount', alignRight: false },
  { id: 'status', label: 'Status', alignRight: false },
  { id: 'paymentStatus', label: 'Payment Status', alignRight: false },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  if (query) {
    return filter(array, (_user) => _user.customers.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
  }
  return stabilizedThis.map((el) => el[0]);
}

export default function OrdersPage() {
  const { orders, isLoading, deleteOrder } = useOrders();

  const [page, setPage] = useState(0);

  const [order, setOrder] = useState('asc');

  const [selected, setSelected] = useState([]);

  const [orderBy, setOrderBy] = useState('name');

  const [filterName, setFilterName] = useState('');

  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = orders.map((n) => n.customers.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleFilterByName = (event) => {
    setPage(0);
    setFilterName(event.target.value);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - orders.length) : 0;

  const filteredOrders = applySortFilter(orders, getComparator(order, orderBy), filterName);

  const isNotFound = !filteredOrders.length && !!filterName;

  const formatDate = (dateString) => {
    const d = dateString.split('T')[0];
    return d;
  };

  return (
    <>
      <Helmet>
        <title> Orders | Minimal UI </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Orders
          </Typography>
        </Stack>

        <Card>
          <UserListToolbar
            selected={selected}
            setSelected={setSelected}
            filterName={filterName}
            onFilterName={handleFilterByName}
            deleteFunction={deleteOrder}
          />

          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              {isLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Spinner />
                </div>
              ) : (
                <Table>
                  <UserListHead
                    order={order}
                    orderBy={orderBy}
                    headLabel={TABLE_HEAD}
                    rowCount={orders.length}
                    numSelected={selected.length}
                    onRequestSort={handleRequestSort}
                    onSelectAllClick={handleSelectAllClick}
                  />
                  <TableBody>
                    {filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                      const { id, customers, created_at: orderDate, items, status, totalAmount, paymentStatus } = row;
                      const selectedUser = selected.indexOf(customers.name) !== -1;

                      return (
                        <TableRow hover key={id} tabIndex={-1} role="checkbox" selected={selectedUser}>
                          <TableCell padding="checkbox">
                            <Checkbox checked={selectedUser} onChange={(event) => handleClick(event, customers.name)} />
                          </TableCell>

                          <TableCell component="th" scope="row" padding="none">
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar>{customers.name.slice(0, 1).toUpperCase()}</Avatar>
                              <Typography variant="subtitle2" noWrap>
                                {customers.name}
                              </Typography>
                            </Stack>
                          </TableCell>

                          <TableCell align="left">{formatDate(orderDate)}</TableCell>

                          <TableCell align="left">
                            {items.map((item) => (
                              <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>{item.productName}</div>
                                <div>{item.quantity}</div>
                              </div>
                            ))}
                          </TableCell>

                          <TableCell align="left">{totalAmount}</TableCell>

                          <TableCell align="left">
                            <Label
                              color={
                                (status === 'pending' && 'warning') ||
                                (status === 'in-transit' && 'info') ||
                                (status === 'cancelled' && 'error') ||
                                (status === 'delivered' && 'success')
                              }
                            >
                              {sentenceCase(status)}
                            </Label>
                          </TableCell>

                          <TableCell align="left">
                            <Label
                              color={
                                (paymentStatus === 'not paid' && 'warning') || (paymentStatus === 'paid' && 'success')
                              }
                            >
                              {sentenceCase(paymentStatus)}
                            </Label>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: 53 * emptyRows }}>
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>

                  {isNotFound && (
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                          <Paper
                            sx={{
                              textAlign: 'center',
                            }}
                          >
                            <Typography variant="h6" paragraph>
                              Not found
                            </Typography>

                            <Typography variant="body2">
                              No results found for &nbsp;
                              <strong>&quot;{filterName}&quot;</strong>.
                              <br /> Try checking for typos or using complete words.
                            </Typography>
                          </Paper>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              )}
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </>
  );
}

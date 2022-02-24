import { useState } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import TablePagination from '@material-ui/core/TablePagination';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { v4 } from 'uuid';

function Row(props) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {row.device_name}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Typography variant="h6" gutterBottom component="div">
                Logs
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>execution number</TableCell>
                    <TableCell>executionCpuTime</TableCell>
                    <TableCell align="right">uploadTime</TableCell>
                    <TableCell align="right">donwloadTime</TableCell>
                    <TableCell align="right">uploadSize</TableCell>
                    <TableCell align="right">downloadSize</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.logs
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((historyRow) => (
                      <TableRow key={v4()}>
                        <TableCell component="th" scope="row">
                          {historyRow.execution_number}
                        </TableCell>
                        <TableCell>{historyRow.executionCpuTime}</TableCell>
                        <TableCell align="right">
                          {historyRow.uploadTime}
                        </TableCell>
                        <TableCell align="right">
                          {historyRow.donwloadTime}
                        </TableCell>
                        <TableCell align="right">
                          {historyRow.uploadSize}
                        </TableCell>
                        <TableCell align="right">
                          {historyRow.downloadSize}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 15]}
                component="div"
                count={row.logs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

Row.propTypes = {
  row: PropTypes.shape({
    logs: PropTypes.arrayOf(
      PropTypes.shape({
        execution_number: PropTypes.number.isRequired,
        executionCpuTime: PropTypes.number.isRequired,
        uploadTime: PropTypes.number.isRequired,
        donwloadTime: PropTypes.number.isRequired,
        uploadSize: PropTypes.number.isRequired,
        downloadSize: PropTypes.number.isRequired,
      })
    ).isRequired,
    device_name: PropTypes.string.isRequired,
  }).isRequired,
};

export default function CollapsibleTable({ rows }) {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>Device</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <Row key={row.name} row={row} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CollapsibleTable.propTypes = {
  rows: PropTypes.oneOfType([PropTypes.array]).isRequired,
};

/* eslint-disable no-return-await */
/* eslint-disable func-names */
import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  AppBar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Toolbar,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { useHistory } from 'react-router-dom';

import axios from 'axios';
import { GraphContext } from '~/context/GraphContext';
import CollapsibleTable from './CollapsibleTable';
import { createExecutionLogs } from '~/helpers/executionFactory';
import { ApiContext } from '~/context/ApiContext';
import { SnackbarContext } from '~/context/SnackContext';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  appBar: {
    position: 'relative',
    backgroundColor: '#28262e',
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  // contentVnc: {
  //   height: '100vh',
  // },
}));

const ShowTableModal = forwardRef((props, ref) => {
  const classes = useStyles();
  const { snackBarOpen } = useContext(SnackbarContext);
  const { ip } = useContext(ApiContext);
  const { name } = useContext(GraphContext);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [logsApi, setLogsApi] = useState([]);

  function clearStates() {
    setOpen((x) => !x);
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    close: () => {
      setOpen((x) => !x);
    },
  }));

  const handleClose = () => {
    clearStates();
  };

  const getLogs = useCallback(async () => {
    try {
      const response = await axios.get(`http://${ip}:5000/exec/logs`);
      if (response.data?.code === 200) {
        setLogsApi(response.data?.execution_log);
        setRows(createExecutionLogs(response.data?.execution_log));
      }
    } catch (err) {
      console.log(err);
    }
  }, [ip]);

  useEffect(() => {
    if (open) getLogs();
  }, [getLogs, open]);

  const handleDownloadLogs = async () => {
    try {
      const fileName = `${name}`;
      const json = JSON.stringify(logsApi);
      const blob = new Blob([json], { type: 'application/json' });
      const href = await URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = `${fileName}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      {open && (
        <Dialog
          open={open}
          aria-labelledby="customized-dialog-title"
          maxWidth="md"
          fullWidth
        >
          <AppBar className={classes.appBar}>
            <Toolbar>
              <Typography variant="h4" className={classes.title}>
                Results Tests
              </Typography>
              <Button autoFocus color="inherit" onClick={handleDownloadLogs}>
                Download Logs
              </Button>
            </Toolbar>
          </AppBar>
          <DialogContent>
            {rows && <CollapsibleTable rows={rows} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

ShowTableModal.displayName = 'ShowTableModal';

ShowTableModal.propTypes = {};

ShowTableModal.defaultProps = {
  onSubmit: null,
};

export default ShowTableModal;

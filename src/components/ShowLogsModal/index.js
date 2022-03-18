/* eslint-disable no-return-await */
/* eslint-disable func-names */
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
  Toolbar,
  Typography,
} from '@material-ui/core';

import appApi from '~/services/app';

import CollapsibleTable from './CollapsibleTable';
import { createExecutionLogs } from '~/utils/helpers/executionFactory';
import { ApiContext } from '~/context/ApiContext';
import { ScenarioContext } from '~/context/ScenarioContext';

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
}));

const ShowLogsModal = forwardRef((props, ref) => {
  const classes = useStyles();
  const { ip } = useContext(ApiContext);
  const { name } = useContext(ScenarioContext);
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
      const response = await appApi.getAllLogs(ip);
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
              <Typography variant="h5" className={classes.title}>
                Test Result
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

ShowLogsModal.displayName = 'ShowLogsModal';

ShowLogsModal.propTypes = {};

ShowLogsModal.defaultProps = {
  onSubmit: null,
};

export default ShowLogsModal;

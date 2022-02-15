/* eslint-disable no-return-await */
/* eslint-disable func-names */
import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  DialogActions,
  DialogContent,
  Grid,
  Divider,
  Dialog,
  Button,
} from '@material-ui/core';

import axios from 'axios';
import { DialogTitleCustom } from './styles';
import { ApiContext } from '~/context/ApiContext';
import remove from '~/assets/remove.svg';
import AddAppModal from '../AddAppModal';
import ExecAppModal from '../ExecAppModal';
import { SnackbarContext } from '~/context/SnackContext';
import { GraphContext } from '~/context/GraphContext';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: 0,
    paddingRight: 0,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

const AppAreaModal = forwardRef((props, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const addAppRef = useRef();
  const execAppRef = useRef();
  const { snackBarOpen } = useContext(SnackbarContext);
  const { ip } = useContext(ApiContext);
  const { name } = useContext(GraphContext);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    close: () => {
      setOpen((x) => !x);
    },
  }));

  const handleClose = () => {
    setOpen((x) => !x);
  };
  const handleAppModal = () => {
    addAppRef.current?.open();
  };

  const handleExecModal = () => {
    execAppRef.current?.open();
  };
  const handleDownloadLogs = async () => {
    snackBarOpen('Execution Logs', 'info');
    try {
      const response = await axios.get(`http://${ip}:5000/exec/logs`);
      if (response.data?.code === 200) {
        const fileName = `${name}`;
        const json = JSON.stringify(response.data?.execution_log);
        const blob = new Blob([json], { type: 'application/json' });
        const href = await URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = `${fileName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        snackBarOpen('Error. Try Again Later.', 'error');
      }
    } catch (err) {
      console.log(err);
      snackBarOpen('Error. Try Again Later.', 'error');
    }
  };

  function clearStates() {
    handleClose();
  }

  return (
    <>
      {open && (
        <Dialog open={open} maxWidth="sm" fullWidth onClose={handleClose}>
          <DialogTitleCustom id="customized-dialog-title">
            <p>App Area</p>
            <button type="button" onClick={handleClose}>
              <img src={remove} alt="MCC Network" />
            </button>
          </DialogTitleCustom>
          <Divider />
          <DialogContent
            style={{ width: '100%', display: 'flex', flexDirection: 'column' }}
          >
            <Button type="button" onClick={handleAppModal}>
              Add Apk
            </Button>
            <Button type="button" onClick={handleExecModal}>
              Exec Apk
            </Button>
            <Button type="button" onClick={handleDownloadLogs}>
              Download logs
            </Button>
          </DialogContent>
          <AddAppModal ref={addAppRef} />
          <ExecAppModal ref={execAppRef} handleCloseAppArea={handleClose} />
        </Dialog>
      )}
    </>
  );
});

AppAreaModal.displayName = 'AppAreaModal';

export default AppAreaModal;

/* eslint-disable no-return-await */
/* eslint-disable func-names */
import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import TextField from '@material-ui/core/TextField';

import axios from 'axios';

import { TrafficOutlined } from '@material-ui/icons';
import { Action, ActionContent, Success, Error } from './styles';
import { ApiContext } from '~/context/ApiContext';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  // contentVnc: {
  //   height: '100vh',
  // },
}));

const ConfigModal = forwardRef((props, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { ip: ipSave, changeIp } = useContext(ApiContext);
  const [ip, setIp] = useState(ipSave);
  const [isLoading, setLoading] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [error, setError] = useState(false);

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

  function clearStates() {
    setConnected(false);
    setError(false);
    handleClose();
  }

  function handleChangeIp(event) {
    setIp(event.target.value);
  }

  async function promiseOptions() {
    setLoading(true);
    setConnected(false);
    setError(false);
    try {
      const response = await axios.get(`http://${ip}:5000/status`);
      if (response.data.code === 200) {
        setConnected(true);
      } else {
        setError(true);
      }
    } catch (er) {
      console.log(er);
      setConnected(false);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmitSave() {
    changeIp(ip);
    clearStates();
  }

  return (
    <>
      {open && (
        <Dialog
          open={open}
          aria-labelledby="customized-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="customized-dialog-title" className={classes.title}>
            Configuration
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="api"
              label="Ip"
              type="text"
              fullWidth
              value={ip}
              onChange={handleChangeIp}
              autoComplete="off"
              aria-autocomplete="none"
              placeholder="Enter the server IP"
            />
            <div style={{ display: 'flex', flexDirection: 'row', flex: 1 }}>
              <Button
                onClick={promiseOptions}
                disabled={ip === ''}
                color="primary"
              >
                Connection Test
                {isLoading && (
                  <ActionContent>
                    <Action loading={isLoading ? 1 : 0} />
                  </ActionContent>
                )}
              </Button>
              {isConnected && <Success>Connected</Success>}
              {error && <Error>Connection error</Error>}
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleSubmitSave}
              disabled={!isConnected}
              color="primary"
            >
              Salve
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

ConfigModal.displayName = 'ConfigModal';

export default ConfigModal;

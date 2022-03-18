import { useState, forwardRef, useImperativeHandle, useContext } from 'react';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import scenarioApi from '~/services/scenario';
import appApi from '~/services/app';

import { Action, ActionContent, Success, Error } from './styles';
import { ApiContext } from '~/context/ApiContext';
import IpMaskInput from '../IpMaskInput';

const ServerConfigurationModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const { ip: ipSave, changeIp } = useContext(ApiContext);
  const [ip, setIp] = useState(ipSave);
  const [ipError, setIpError] = useState(false);
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

  async function promiseOptions() {
    setLoading(true);
    setConnected(false);
    setError(false);
    try {
      const response = await scenarioApi.apiStatus(ip);
      if (response.data.code === 200) {
        await appApi.executionClean(ip);
        await scenarioApi.stopScenario(ip);
        setConnected(true);
      } else {
        setError(true);
      }
    } catch (er) {
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
          // fullWidth
        >
          <DialogTitle id="customized-dialog-title">
            Server Configuration
          </DialogTitle>
          <DialogContent>
            <IpMaskInput
              onChange={setIp}
              value={ip}
              error={ipError}
              setError={setIpError}
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
              Cancel
            </Button>
            <Button
              onClick={handleSubmitSave}
              disabled={!isConnected}
              color="primary"
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

ServerConfigurationModal.displayName = 'ServerConfigurationModal';

export default ServerConfigurationModal;

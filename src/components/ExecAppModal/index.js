/* eslint-disable no-return-await */
/* eslint-disable func-names */
import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import axios from 'axios';

import { ApiContext } from '~/context/ApiContext';
import { SnackbarContext } from '~/context/SnackContext';
import { GraphContext } from '~/context/GraphContext';
import { execStatus } from '~/services/execApp';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  // contentVnc: {
  //   height: '100vh',
  // },
}));

const ExecAppModal = forwardRef(({ handleCloseAppArea }, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [appName, setAppName] = useState('');
  const [appList, setAppLis] = useState([]);
  const [logTag, setLogTag] = useState('DebugRpc');
  const [mainActivity, setMainActivity] = useState(
    'com.example.renan.kotlinmpos/.MainActivity'
  );
  const [runActivity, setRunActivity] = useState(
    'com.example.renan.kotlinmpos/.MainActivity'
  );
  const [extras, setExtras] = useState('--es cloudlet 10.0.0.12');
  const [broadcastSignal, setBroadcasSignal] = useState(
    'com.example.renan.kotlinmpos.EXTRAS'
  );
  const [argumentsExec, setArgumentsExec] = useState(
    "--es 'operation' 'mul' --ei 'size' 600"
  );
  const [interactions, setInteractions] = useState('2');
  const [appNameError, setAppNameError] = useState(false);
  const [logTagError, setLogTagError] = useState(false);
  const [mainActivityError, setMainActivityError] = useState(false);
  const [runActivityError, setRunActivityError] = useState(false);
  const [broadcastSignalError, setBroadcasSignalError] = useState(false);
  const [interactionsError, setInteractionsError] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const { setExecApkStatus } = useContext(GraphContext);
  const { ip } = useContext(ApiContext);
  const { snackBarOpen } = useContext(SnackbarContext);

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
    handleClose();
  }

  async function getAllApk() {
    try {
      const response = await axios.get(`http://${ip}:5000/apks/list`);
      if (response.data.code === 200) {
        setAppLis(response.data.apks);
      }
    } catch (err) {
      console.log(err);
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (open) getAllApk();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleChangeAppName(event) {
    const appNameChange = event.target.value.trim();
    if (appNameChange) {
      setAppName(appNameChange);
      setAppNameError(false);
    } else setAppNameError(true);
  }

  function handleChangeLogTag(event) {
    const logTagChange = event.target.value.trim();
    if (logTagChange) {
      setLogTag(logTagChange);
      setLogTagError(false);
    } else setLogTagError(true);
  }

  function handleChangeMainActivity(event) {
    const mainActivityChange = event.target.value.trim();
    if (mainActivityChange) {
      setMainActivity(mainActivityChange);
      setMainActivityError(false);
    } else setMainActivityError(true);
  }

  function handleChangeRunActivity(event) {
    const runActivityChange = event.target.value.trim();
    if (runActivityChange) {
      setRunActivity(runActivityChange);
      setRunActivityError(false);
    } else setRunActivityError(true);
  }

  function handleChangeExtras(event) {
    const extrasChange = event.target.value.trim();
    setExtras(extrasChange);
  }

  function handleChangeBroadcasSignal(event) {
    const broadcasSignalChange = event.target.value.trim();
    if (broadcasSignalChange) {
      setBroadcasSignal(broadcasSignalChange);
      setBroadcasSignalError(false);
    } else setBroadcasSignalError(true);
  }

  function handleChangeArgumentsExec(event) {
    const argumentsExecChange = event.target.value.trim();
    setArgumentsExec(argumentsExecChange);
  }

  const handleChangeInteractions = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setInteractions(value);
    if (value) {
      setInteractionsError(false);
    } else setInteractionsError(true);
  };

  function validation() {
    let validated = true;
    if (!appName) {
      setAppNameError(true);
      validated = false;
    }
    if (!logTag) {
      setLogTagError(true);
      validated = false;
    }
    if (!mainActivity) {
      setMainActivityError(true);
      validated = false;
    }
    if (!runActivity) {
      setRunActivityError(true);
      validated = false;
    }
    if (!broadcastSignal) {
      setBroadcasSignalError(true);
      validated = false;
    }
    if (!interactions) {
      setInteractionsError(true);
      validated = false;
    }
    return validated;
  }

  async function execApp() {
    snackBarOpen('Loading Exec Apk.', 'info');
    setDisabled(true);
    try {
      const data = {
        app_name: appName,
        log_tag: logTag,
        main_activity: mainActivity,
        run_activity: runActivity,
        extras,
        broadcast_signal: broadcastSignal,
        arguments: argumentsExec,
        interactions: Number(interactions),
      };
      console.log(data);
      const response = await axios.post(`http://${ip}:5000/exec`, data);
      await execStatus(ip, setExecApkStatus);
      console.log(response);
      snackBarOpen('Successful Exec Apk.', 'success');
    } catch (err) {
      console.log(err);
      snackBarOpen('Error. Try Again Later.', 'error');
    } finally {
      setDisabled(false);
    }
  }

  async function handleSubmitSave() {
    if (validation()) {
      await execApp();
      handleClose();
      handleCloseAppArea();
    }
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
            Execution App
          </DialogTitle>
          <DialogContent>
            <FormControl
              className={classes.formControl}
              fullWidth
              margin="dense"
            >
              <InputLabel id="type">App Name</InputLabel>
              <Select
                labelId="Enter the APK name"
                id="type"
                value={appName}
                onChange={handleChangeAppName}
                fullWidth
                error={appNameError}
              >
                {appList?.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              autoFocus
              margin="dense"
              id="api"
              label="Log Tag"
              type="text"
              fullWidth
              value={logTag}
              onChange={handleChangeLogTag}
              autoComplete="off"
              aria-autocomplete="none"
              placeholder="Enter the Log Tag"
              error={logTagError}
            />
            <TextField
              autoFocus
              margin="dense"
              id="api"
              label="MainActivity"
              type="text"
              fullWidth
              value={mainActivity}
              onChange={handleChangeMainActivity}
              autoComplete="off"
              aria-autocomplete="none"
              placeholder="Enter the MainActivity"
              error={mainActivityError}
            />
            <TextField
              autoFocus
              margin="dense"
              id="api"
              label="RunActivity"
              type="text"
              fullWidth
              value={runActivity}
              onChange={handleChangeRunActivity}
              autoComplete="off"
              aria-autocomplete="none"
              placeholder="Enter the RunActivity"
              error={runActivityError}
            />
            <TextField
              autoFocus
              margin="dense"
              id="api"
              label="Extras"
              type="text"
              fullWidth
              value={extras}
              onChange={handleChangeExtras}
              autoComplete="off"
              aria-autocomplete="none"
              placeholder="Enter the Extras"
            />
            <TextField
              autoFocus
              margin="dense"
              id="api"
              label="Broadcast Signal"
              type="text"
              fullWidth
              value={broadcastSignal}
              onChange={handleChangeBroadcasSignal}
              autoComplete="off"
              aria-autocomplete="none"
              placeholder="Enter the Broadcast Signal"
              error={broadcastSignalError}
            />
            <TextField
              autoFocus
              margin="dense"
              id="api"
              label="Arguments"
              type="text"
              fullWidth
              value={argumentsExec}
              onChange={handleChangeArgumentsExec}
              autoComplete="off"
              aria-autocomplete="none"
              placeholder="Enter the Arguments"
            />
            <TextField
              autoFocus
              margin="dense"
              id="api"
              label="Interactions"
              type="text"
              fullWidth
              value={interactions}
              onChange={handleChangeInteractions}
              autoComplete="off"
              aria-autocomplete="none"
              placeholder="Enter the Interactions"
              error={interactionsError}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              color="secundary"
              disabled={isDisabled}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitSave}
              color="primary"
              disabled={isDisabled}
            >
              Salve
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

ExecAppModal.displayName = 'ExecAppModal';

ExecAppModal.propTypes = {
  handleCloseAppArea: PropTypes.func.isRequired,
};

export default ExecAppModal;

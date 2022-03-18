/* eslint-disable no-return-await */
/* eslint-disable func-names */
import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { Select, InputLabel, MenuItem, FormControl } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';

import { ApiContext } from '~/context/ApiContext';
import { SnackbarContext } from '~/context/SnackContext';
import { ScenarioContext } from '~/context/ScenarioContext';
import appApi from '~/services/app';
import CustomNetworkModal from '../CustomNetworkModal';

const ExecAppModal = forwardRef(({ handleCloseAppArea }, ref) => {
  const [open, setOpen] = useState(false);
  const [appName, setAppName] = useState('');
  const [appList, setAppLis] = useState([]);
  const [logTag, setLogTag] = useState('DebugRpc');
  const [mainActivity, setMainActivity] = useState(
    'br.ufc.mdcc.benchimage2/.MainActivity'
  );
  const [runActivity, setRunActivity] = useState(
    'br.ufc.mdcc.benchimage2/.MainActivity'
  );
  const [extras, setExtras] = useState('--es cloudlet ');
  const [broadcastSignal, setBroadcasSignal] = useState('benchimage2.EXTRAS');
  const [argumentsExec, setArgumentsExec] = useState(
    '--ei size 4 --ei filter 2 --ei local 1'
  );
  const [interactions, setInteractions] = useState('');
  const [appNameError, setAppNameError] = useState(false);
  const [logTagError, setLogTagError] = useState(false);
  const [mainActivityError, setMainActivityError] = useState(false);
  const [runActivityError, setRunActivityError] = useState(false);
  const [broadcastSignalError, setBroadcasSignalError] = useState(false);
  const [interactionsError, setInteractionsError] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const { setExecApkStatus } = useContext(ScenarioContext);
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

  const getAllApk = useCallback(async () => {
    try {
      const response = await appApi.getAllApk(ip);
      if (response.data.code === 200) {
        setAppLis(response.data.apks);
      }
      // eslint-disable-next-line no-empty
    } catch (err) {}
  }, [ip]);

  useEffect(() => {
    if (open) getAllApk();
  }, [open, getAllApk]);

  function handleChangeAppName(event) {
    const appNameChange = event.target.value;
    setAppName(appNameChange);
    if (appNameChange) {
      setAppNameError(false);
    } else setAppNameError(true);
  }

  function handleChangeLogTag(event) {
    const logTagChange = event.target.value;
    setLogTag(logTagChange);
    if (logTagChange) {
      setLogTagError(false);
    } else setLogTagError(true);
  }

  function handleChangeMainActivity(event) {
    const mainActivityChange = event.target.value;
    setMainActivity(mainActivityChange);
    if (mainActivityChange) {
      setMainActivityError(false);
    } else setMainActivityError(true);
  }

  function handleChangeRunActivity(event) {
    const runActivityChange = event.target.value;
    setRunActivity(runActivityChange);
    if (runActivityChange) {
      setRunActivityError(false);
    } else setRunActivityError(true);
  }

  function handleChangeExtras(event) {
    const extrasChange = event.target.value;
    setExtras(extrasChange);
  }

  function handleChangeBroadcasSignal(event) {
    const broadcasSignalChange = event.target.value;
    setBroadcasSignal(broadcasSignalChange);
    if (broadcasSignalChange) {
      setBroadcasSignalError(false);
    } else setBroadcasSignalError(true);
  }

  function handleChangeArgumentsExec(event) {
    const argumentsExecChange = event.target.value;
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
        log_tag: logTag.trim(),
        main_activity: mainActivity.trim(),
        run_activity: runActivity.trim(),
        extras: extras.trim(),
        broadcast_signal: broadcastSignal.trim(),
        arguments: argumentsExec.trim(),
        interactions: Number(interactions),
      };
      await appApi.executionClean(ip);
      await appApi.executionApk(ip, data);
      await appApi.executionStatus(ip, setExecApkStatus);
      snackBarOpen('Successful Exec Apk.', 'success');
    } catch (err) {
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

  function renderExecAppContent() {
    return (
      <>
        <FormControl fullWidth margin="dense">
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
      </>
    );
  }

  return (
    <>
      {open && (
        <CustomNetworkModal
          open={open}
          title="Execution App"
          titleCancel="Cancel"
          titleSubmit="Execution"
          handleClose={handleClose}
          handleSubmit={handleSubmitSave}
          ContentComponent={renderExecAppContent()}
          propsCancel={{ disabled: isDisabled }}
          propsSubmit={{ disabled: isDisabled }}
        />
      )}
    </>
  );
});

ExecAppModal.displayName = 'ExecAppModal';

ExecAppModal.propTypes = {
  handleCloseAppArea: PropTypes.func.isRequired,
};

export default ExecAppModal;

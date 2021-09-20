/* eslint-disable no-return-await */
/* eslint-disable func-names */
import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useContext,
} from 'react';
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
import androidUpload from '~/assets/android_upload.svg';

import { Action, ActionContent, Success, Error, UploadApk } from './styles';
import { ApiContext } from '~/context/ApiContext';
import { DialogCustom } from '../AppAreaModal/styles';
import { SnackbarContext } from '~/context/SnackContext';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  // contentVnc: {
  //   height: '100vh',
  // },
}));

const AddAppModal = forwardRef((props, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [apk, setApk] = useState(null);
  const uploadRef = useRef();
  const [nameError, setNameError] = useState(false);
  const [uploadError, setUploadError] = useState(false);
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

  function clearStates() {
    setApk(null);
    setName('');
    setNameError(false);
    setUploadError(false);
  }

  const handleClose = () => {
    clearStates();
    setOpen((x) => !x);
  };

  function handleChangeName(event) {
    const nameChange = event.target.value.trim();
    if (nameChange) {
      setName(nameChange);
      setNameError(false);
    } else setNameError(true);
  }

  function validation() {
    let validated = true;
    if (!name) {
      setNameError(true);
      validated = false;
    }
    if (!apk) {
      setUploadError(true);
      validated = false;
    }
    return validated;
  }

  async function sendApk() {
    snackBarOpen('Loading Apk', 'info');
    try {
      const formData = new FormData();
      formData.append('file', apk);
      await axios.post(`http://${ip}:5000/apks/${name}.apk`, formData, {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      });
      snackBarOpen('Successful Adding Apk.', 'success');
    } catch (err) {
      console.log(err);
      snackBarOpen('Error. Try Again Later.', 'error');
    }
  }

  async function handleSubmitSave() {
    if (validation()) {
      await sendApk();
      handleClose();
    }
  }

  function upload() {
    uploadRef.current.click();
  }

  function openFile(evt) {
    const apkFile = evt.target.files[0];
    if (apkFile) {
      setApk(apkFile);
      setUploadError(false);
    }
  }

  return (
    <>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle id="customized-dialog-title" className={classes.title}>
            Add Apk
          </DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="api"
              label="Name"
              type="text"
              fullWidth
              value={name}
              onChange={handleChangeName}
              autoComplete="off"
              aria-autocomplete="none"
              placeholder="Enter the APK name"
              error={nameError}
            />

            <UploadApk type="button" onClick={upload} error={uploadError}>
              <p>Upload apk {apk && `: ${apk.name}`}</p>
              <img src={androidUpload} alt="Android upload" />
              <input
                type="file"
                className="hidden"
                multiple={false}
                accept=".apk"
                onChange={(evt) => openFile(evt)}
                ref={uploadRef}
              />
            </UploadApk>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secundary">
              Cancel
            </Button>
            <Button onClick={handleSubmitSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

AddAppModal.displayName = 'AddAppModal';

export default AddAppModal;

import {
  useState,
  forwardRef,
  useImperativeHandle,
  useRef,
  useContext,
} from 'react';

import TextField from '@material-ui/core/TextField';
import androidUpload from '~/assets/android_upload.svg';

import appApi from '~/services/app';

import CustomNetworkModal from '../CustomNetworkModal';
import { UploadApk } from './styles';
import { ApiContext } from '~/context/ApiContext';
import { SnackbarContext } from '~/context/SnackContext';

const AddAppModal = forwardRef((props, ref) => {
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
      await appApi.saveApk(ip, name, formData);
      snackBarOpen('Successful Adding Apk.', 'success');
    } catch (err) {
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

  function renderAppContent() {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      {open && (
        <>
          <CustomNetworkModal
            open={open}
            title="Add Apk"
            titleCancel="Cancel"
            titleSubmit="Save"
            handleClose={handleClose}
            handleSubmit={handleSubmitSave}
            ContentComponent={renderAppContent()}
          />
        </>
      )}
    </>
  );
});

AddAppModal.displayName = 'AddAppModal';

export default AddAppModal;

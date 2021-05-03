/* eslint-disable no-return-await */
/* eslint-disable func-names */
import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  // contentVnc: {
  //   height: '100vh',
  // },
}));

const VncModal = forwardRef(({ vncPort, removeData }, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    close: () => {
      setOpen((x) => !x);
    },
  }));

  const handleClose = () => {
    removeData();
    setOpen((x) => !x);
  };

  function clearStates() {
    setOpen((x) => !x);
  }

  return (
    <>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          maxWidth="xd"
          fullWidth
          fullScreen
        >
          <DialogTitle id="customized-dialog-title" className={classes.title}>
            VNC
          </DialogTitle>
          <DialogContent>
            <iframe
              title="vnc"
              src={`http://${process.env.REACT_APP_IP}:${vncPort}/vnc_auto.html`}
              frameBorder="0"
              width="100%"
              height="100%"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            {/* <Button onClick={handleSubmit} color="primary">
              Close
            </Button> */}
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

VncModal.displayName = 'VncModal';

VncModal.propTypes = {
  vncPort: PropTypes.string.isRequired,
  removeData: PropTypes.func.isRequired,
};

export default VncModal;

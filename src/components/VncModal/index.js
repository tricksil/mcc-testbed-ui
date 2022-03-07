/* eslint-disable no-return-await */
/* eslint-disable func-names */
import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useMemo,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';
import { v4 } from 'uuid';

import axios from 'axios';
import { Iframe } from './styles';
import { GraphContext } from '~/context/GraphContext';
import { ApiContext } from '~/context/ApiContext';

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
  const [name, setName] = useState('');
  const { findNode } = useContext(GraphContext);
  const { ip } = useContext(ApiContext);
  const [louded, setLouded] = useState(`${v4()}`);
  const [count, setCount] = useState(`${v4()}`);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    name: (value) => {
      const v = findNode(value);
      setName(v.label);
    },
    close: () => {
      setOpen((x) => !x);
    },
  }));

  const handleClose = () => {
    removeData();
    setCount(`${v4()}`);
    setLouded(`${v4()}`);
    setOpen((x) => !x);
  };

  function clearStates() {
    setOpen((x) => !x);
  }

  const getIframe = useCallback(async (ipApi, vncPortApi) => {
    try {
      const response = await axios.get(
        `http://${ipApi}:${vncPortApi}/vnc_auto.html`
      );
      if (response.status === 200 && response.data) {
        setCount(`${v4()}`);
        setLouded('');
      }
    } catch (error) {
      setLouded(`${v4()}`);
    }
  }, []);

  useEffect(() => {
    console.log(louded);
    if (ip && vncPort && louded) getIframe(ip, vncPort);
  }, [getIframe, ip, vncPort, louded]);

  const srcMemo = useMemo(() => `http://${ip}:${vncPort}/vnc_auto.html`, [
    ip,
    vncPort,
  ]);

  return (
    <>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="customized-dialog-title"
          maxWidth="md"
        >
          <DialogTitle id="customized-dialog-title" className={classes.title}>
            {name}
          </DialogTitle>
          <DialogContent
            style={{ width: '80vh', height: '100vw', overflow: 'hidden' }}
          >
            <Iframe
              key={count}
              title="vnc"
              src={srcMemo}
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

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
import {
  DialogCustom,
  DialogTitleCustom,
  ButtonAdd,
  GridContent,
} from './styles';
import { ApiContext } from '~/context/ApiContext';
import remove from '~/assets/remove.svg';
import AddAppModal from '../AddAppModal';
import ExecAppModal from '../ExecAppModal';

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

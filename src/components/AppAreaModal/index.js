/* eslint-disable no-return-await */
/* eslint-disable func-names */
import { useState, forwardRef, useImperativeHandle, useRef } from 'react';
import { DialogContent, Divider, Dialog, Button } from '@material-ui/core';

import { DialogTitleCustom } from './styles';
import remove from '~/assets/remove.svg';
import AddAppModal from '../AddAppModal';
import ExecAppModal from '../ExecAppModal';
import ShowLogsModal from '../ShowLogsModal';

const AppAreaModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const addAppRef = useRef();
  const showLogsRef = useRef();
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

  const handleShowTableModal = () => {
    showLogsRef.current?.open();
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
            <Button type="button" onClick={handleShowTableModal}>
              Show logs
            </Button>
          </DialogContent>
          <AddAppModal ref={addAppRef} />
          <ShowLogsModal ref={showLogsRef} />
          <ExecAppModal ref={execAppRef} handleCloseAppArea={handleClose} />
        </Dialog>
      )}
    </>
  );
});

AppAreaModal.displayName = 'AppAreaModal';

export default AppAreaModal;

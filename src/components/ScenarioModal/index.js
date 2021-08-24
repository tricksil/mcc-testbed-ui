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
import { useHistory } from 'react-router-dom';

import { GraphContext } from '~/context/GraphContext';
import { Error } from './styles';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  // contentVnc: {
  //   height: '100vh',
  // },
}));

const ScenarioModal = forwardRef((props, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const { name, setName } = useContext(GraphContext);
  const history = useHistory();
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
    setName('');
  };

  function clearStates() {
    setOpen((x) => !x);
  }

  const changeName = (event) => {
    setName(event.target.value);
  };

  const handleSubmitSave = () => {
    if (!name) {
      setError(true);
      return;
    }
    history.push('/network');
  };

  return (
    <>
      {open && (
        <Dialog
          open={open}
          aria-labelledby="customized-dialog-title"
          maxWidth="md"
        >
          <DialogTitle id="customized-dialog-title" className={classes.title}>
            Scenario
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
              onChange={changeName}
              autoComplete="off"
              aria-autocomplete="none"
              placeholder="Enter the scenario name"
            />
            {error && <Error>Field cannot be empty</Error>}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSubmitSave} color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

ScenarioModal.displayName = 'VncMScenarioModalodal';

export default ScenarioModal;

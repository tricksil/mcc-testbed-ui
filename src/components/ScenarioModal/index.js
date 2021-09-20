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

const ScenarioModal = forwardRef(({ onSubmit, onClose }, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { onChangeName } = useContext(GraphContext);
  const history = useHistory();
  const [error, setError] = useState(false);

  function clearStates() {
    setName('');
    setError(false);
    setOpen((x) => !x);
    onClose();
  }

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    close: () => {
      setOpen((x) => !x);
      onClose();
    },
  }));

  const handleClose = () => {
    clearStates();
  };

  const changeName = (event) => {
    setName(event.target.value);
    setError(false);
  };

  const handleSubmitSave = async () => {
    if (!name) {
      setError(true);
      return;
    }
    onChangeName(name);
    if (onSubmit() !== null) {
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
          maxWidth="sm"
          fullWidth
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
              error={error}
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

ScenarioModal.propTypes = {
  onSubmit: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

ScenarioModal.defaultProps = {
  onSubmit: null,
};

export default ScenarioModal;

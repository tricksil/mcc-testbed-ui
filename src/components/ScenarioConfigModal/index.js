/* eslint-disable consistent-return */
import { useState, forwardRef, useImperativeHandle, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import AsyncSelect from 'react-select/async';

import axios from 'axios';

import { ContainerSelect, Info } from './styles';
import { ApiContext } from '~/context/ApiContext';
import { GraphContext } from '~/context/GraphContext';
import { SnackbarContext } from '~/context/SnackContext';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const ScenarioConfigModal = forwardRef((props, ref) => {
  const { graph, convertionalScenery, name } = useContext(GraphContext);
  const { snackBarOpen } = useContext(SnackbarContext);
  const { ip } = useContext(ApiContext);
  const [isLoading, setLoading] = useState(false);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();

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

  async function handleSuccess() {
    if (graph?.nodes.length === 0) {
      snackBarOpen('Scenario not be void!', 'error');
      setLoading((x) => !x);
      return;
    }
    const sceneryTestbed = convertionalScenery(graph);
    try {
      snackBarOpen('Loading Scenery', 'info');
      const { data } = await axios.post(
        `http://${ip}:5000/scenarios/${name}`,
        sceneryTestbed
      );
      if (data.code === 400) {
        snackBarOpen(data.message, 'error');
      } else {
        snackBarOpen(data.message, 'success');
      }
    } catch (error) {
      snackBarOpen('Erro', 'error');
    } finally {
      setOpen((x) => !x);
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
          <DialogTitle id="customized-dialog-title">
            Do you want to save the {name} scenario?
          </DialogTitle>
          <DialogContent />
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" onClick={handleSuccess}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

ScenarioConfigModal.displayName = 'ScenarioConfigModal';

export default ScenarioConfigModal;

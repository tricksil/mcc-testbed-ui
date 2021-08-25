/* eslint-disable consistent-return */
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
  useCallback,
} from 'react';
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

import { ScenarioContent, Container } from './styles';
import { ApiContext } from '~/context/ApiContext';
import { GraphContext } from '~/context/GraphContext';
import { SnackbarContext } from '~/context/SnackContext';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    textTransform: 'capitalize',
  },
}));

const SearchModal = forwardRef((props, ref) => {
  const { ip } = useContext(ApiContext);
  const { convertionalScenaryToVis } = useContext(GraphContext);
  const { snackBarOpen } = useContext(SnackbarContext);
  const [seleted, setSeleted] = useState({});
  const [scenarios, setScenarios] = useState([]);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const getScenarios = useCallback(async () => {
    try {
      const response = await axios.get(`http://${ip}:5000/scenarios/list`);
      setScenarios(response.data.scenarios);
    } catch (error) {
      console.log(error);
    }
  }, [ip]);

  useEffect(() => {
    getScenarios();
  }, [getScenarios]);

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
    setSeleted({});
  };

  function handleSuccess() {
    if (!seleted) {
      snackBarOpen('Error getting scenario', 'error');
      return;
    }
    convertionalScenaryToVis(JSON.stringify(seleted.configuration));
    snackBarOpen('Successfully obtained scenario', 'success');
    history.push('/network');
  }

  const renderScenarios = useCallback(
    () =>
      scenarios?.map((value) => (
        <ScenarioContent
          key={value.name}
          onClick={() => setSeleted(value)}
          select={value.name === seleted.name}
        >
          <p>{value.name}</p>
        </ScenarioContent>
      )),
    [scenarios, seleted.name]
  );

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
            Search Scenarios
          </DialogTitle>
          <DialogContent>
            <Container>{renderScenarios()}</Container>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" onClick={handleSuccess}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

SearchModal.displayName = 'SearchModal';

export default SearchModal;

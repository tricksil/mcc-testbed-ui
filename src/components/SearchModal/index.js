/* eslint-disable consistent-return */
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
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

import { ContainerSelect, colourStyles, Info } from './styles';
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
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setSeleted({});
  }, []);

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

  const promiseOptions = async () => {
    try {
      const response = await axios.get(`http://${ip}:5000/scenarios/list`);
      return response.data?.scenarios?.map((scenario) => ({
        label: scenario.name,
        value: scenario.configuration,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  function handleSuccess() {
    console.log(seleted);
    if (!seleted) {
      snackBarOpen('Error getting scenario', 'error');
      return;
    }
    convertionalScenaryToVis(JSON.stringify(seleted.value));
    snackBarOpen('Successfully obtained scenario', 'success');
    history.push('/network');
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
            Search Scenarios
          </DialogTitle>
          <DialogContent>
            <ContainerSelect>
              <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={promiseOptions}
                styles={colourStyles}
                value={seleted}
                onChange={(scenario) => setSeleted(scenario)}
                placeholder="Select..."
              />
            </ContainerSelect>
            {seleted?.value && <Info {...seleted.value} />}
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

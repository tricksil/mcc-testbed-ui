/* eslint-disable consistent-return */
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import AsyncSelect from 'react-select/async';

import { GraphContext } from '~/context/GraphContext';
import api from '~/services/api';

import { ContainerSelect, colourStyles, Info } from './styles';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    textTransform: 'capitalize',
  },
}));

const SearchModal = forwardRef((props, ref) => {
  const { convertionalScenaryToVis } = useContext(GraphContext);
  const [seleted, setSeleted] = useState({});
  const classes = useStyles();
  const [open, setOpen] = useState(false);

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
      const response = await api.get('/scenarios/list');
      return response.data?.scenarios?.map((scenario) => ({
        label: scenario.name,
        value: scenario.configuration,
      }));
    } catch (error) {
      console.log(error);
    }
  };

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
              />
            </ContainerSelect>
            {seleted?.value && <Info {...seleted.value} />}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button color="primary">Confirm</Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

SearchModal.displayName = 'SearchModal';

export default SearchModal;

/* eslint-disable consistent-return */
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@material-ui/core';

import scenarioApi from '~/services/scenario';

import { ScenarioContent, Container } from './styles';
import { ApiContext } from '~/context/ApiContext';
import { GraphContext } from '~/context/GraphContext';
import { SnackbarContext } from '~/context/SnackContext';
import { ScenarioContext } from '~/context/ScenarioContext';

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
  const { onChangeName } = useContext(ScenarioContext);
  const { snackBarOpen } = useContext(SnackbarContext);
  const [seleted, setSeleted] = useState({});
  const [scenarios, setScenarios] = useState([]);
  const [name, setName] = useState('');
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const history = useHistory();

  const getScenarios = useCallback(async () => {
    try {
      const response = await scenarioApi.getAllScenario(ip);
      setScenarios(response.data.scenarios);
      // eslint-disable-next-line no-empty
    } catch (error) {}
  }, [ip]);

  useEffect(() => {
    if (open) getScenarios();
  }, [open, getScenarios]);

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
    setName('');
  };

  const changeName = (event) => {
    setName(event.target.value);
  };

  function handleSuccess() {
    if (!seleted) {
      snackBarOpen('Error getting scenario', 'error');
      return;
    }
    onChangeName(seleted.name);
    convertionalScenaryToVis(JSON.stringify(seleted.configuration));
    snackBarOpen('Successfully obtained scenario', 'success');
    history.push('/network');
  }

  const scenariosMemo = useMemo(
    () =>
      scenarios.filter((scenario) => scenario.name.includes(name)) || scenarios,
    [name, scenarios]
  );

  const renderScenarios = useCallback(
    () =>
      scenariosMemo?.map((value) => (
        <ScenarioContent
          key={value.name}
          onClick={() => setSeleted(value)}
          select={value.name === seleted.name}
        >
          <p>{value.name}</p>
        </ScenarioContent>
      )),
    [scenariosMemo, seleted.name]
  );

  function renderNameContent() {
    return (
      <>
        <TextField
          autoFocus
          margin="dense"
          id="api"
          label="Search"
          type="text"
          fullWidth
          value={name}
          onChange={changeName}
          autoComplete="off"
          aria-autocomplete="none"
          placeholder="Search for scenario"
        />
      </>
    );
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
            {renderNameContent()}
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

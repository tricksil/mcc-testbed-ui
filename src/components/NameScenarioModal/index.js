import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle, useContext } from 'react';

import TextField from '@material-ui/core/TextField';
import { useHistory } from 'react-router-dom';

import { Error } from './styles';
import CustomNetworkModal from '../CustomNetworkModal';
import { ScenarioContext } from '~/context/ScenarioContext';

const NameScenarioModal = forwardRef(({ onSubmit, onClose, title }, ref) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const { onChangeName } = useContext(ScenarioContext);
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

  function renderNameContent() {
    return (
      <>
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
      </>
    );
  }

  return (
    <>
      {open && (
        <CustomNetworkModal
          open={open}
          title={title}
          titleCancel="Cancel"
          titleSubmit="Confirm"
          handleClose={handleClose}
          handleSubmit={handleSubmitSave}
          ContentComponent={renderNameContent()}
        />
      )}
    </>
  );
});

NameScenarioModal.displayName = 'NameScenarioModal';

NameScenarioModal.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func,
  onClose: PropTypes.func.isRequired,
};

NameScenarioModal.defaultProps = {
  onSubmit: null,
};

export default NameScenarioModal;

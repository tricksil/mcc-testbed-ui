import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

import wireless from '~/assets/wireless.png';
import iphone from '~/assets/iphone.png';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

const AddModal = forwardRef(({ data, setRemoveData }, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('');
  const [name, setName] = useState('');

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    close: () => {
      setOpen((x) => !x);
    },
  }));

  const handleClose = () => {
    setRemoveData();
    setOpen((x) => !x);
  };

  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = () => {
    const { dataNode, callback } = data;
    if (data.type === 'node') {
      const customNode = {
        ...dataNode,
        label: name,
        image: type,
        shape: 'image',
        size: 15,
      };
      callback(customNode);
    } else {
      const customEdge = {
        ...dataNode,
        label: name,
        length: 150,
      };
      callback(customEdge);
    }
    setOpen((x) => !x);
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
          <DialogTitle id="customized-dialog-title">Node</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Name"
              type="text"
              fullWidth
              value={name}
              onChange={handleChangeName}
            />
            {data?.type === 'node' && (
              <FormControl
                className={classes.formControl}
                fullWidth
                margin="dense"
              >
                <InputLabel id="type">Type</InputLabel>
                <Select
                  labelId="type"
                  id="type"
                  value={type}
                  onChange={handleChange}
                  fullWidth
                >
                  <MenuItem value={wireless}>Wireless</MenuItem>
                  <MenuItem value={iphone}>Smartphone</MenuItem>
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Adicionar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
});

AddModal.displayName = 'AddModal';

AddModal.propTypes = {
  setRemoveData: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default AddModal;

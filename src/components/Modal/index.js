import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  InputLabel,
  MenuItem,
  FormControl,
} from '@material-ui/core';

import iphone from '~/assets/iphone.png';
import server from '~/assets/server.png';
import switchDivice from '~/assets/switch.png';

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
  const [ip, setIp] = useState('');
  const [typeDevice, setTypeDevice] = useState('');

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    close: () => {
      setOpen((x) => !x);
    },
  }));

  useEffect(() => {
    if (data.action === 'edit') {
      const { label, image, ip: ipNode } = data.dataNode;
      setName(label);
      setType(image);
      if (ipNode) setIp(ipNode);
    }
  }, [data, data.action]);

  const handleClose = () => {
    setRemoveData();
    setOpen((x) => !x);
    setName('');
    setType('');
    setTypeDevice('');
    setIp('');
  };

  const handleChange = (event) => {
    setType(event.target.value);
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeIp = (event) => {
    setIp(event.target.value);
  };

  function chooseTypeDevice(typeParam) {
    switch (typeParam) {
      case iphone:
        return 'client';
      case server:
        return 'server';
      default:
        return 'switch';
    }
  }

  const handleSubmit = () => {
    const { dataNode, callback } = data;
    const typeChoose = chooseTypeDevice(type);
    if (data.type === 'node') {
      const customNode = {
        ...dataNode,
        label: name,
        shape: 'image',
        image: type,
        size: 10,
        type: typeChoose,
      };
      if (type !== switchDivice) {
        customNode.ip = ip;
        setIp('');
      }
      callback(customNode);
    } else {
      const customEdge = {
        ...dataNode,
        label: name,
        length: 300,
      };
      callback(customEdge);
    }
    setName('');
    setType('');
    setTypeDevice('');
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
              <>
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
                    <MenuItem value={iphone}>Device</MenuItem>
                    <MenuItem value={switchDivice}>Switch</MenuItem>
                    <MenuItem value={server}>Server</MenuItem>
                  </Select>
                </FormControl>

                {type && type !== switchDivice && (
                  <TextField
                    autoFocus
                    margin="dense"
                    id="ip"
                    label="Ip Address"
                    type="text"
                    fullWidth
                    value={ip}
                    onChange={handleChangeIp}
                  />
                )}
              </>
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

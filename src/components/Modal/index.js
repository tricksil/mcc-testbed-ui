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

import phone from '~/assets/iphone.png';
import server from '~/assets/server.png';
import switchDivice from '~/assets/switch.png';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    textTransform: 'capitalize',
  },
}));

const AddModal = forwardRef(({ data, setRemoveData }, ref) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState('');
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
      setDevice(image);
      if (ipNode) setIp(ipNode);
    }
  }, [data, data.action]);

  const handleClose = () => {
    setRemoveData();
    setOpen((x) => !x);
    setName('');
    setDevice('');
    setTypeDevice('');
    setIp('');
  };

  const handleChange = (event) => {
    setDevice(event.target.value);
  };
  const handleChangeName = (event) => {
    setName(event.target.value);
  };
  const handleChangeIp = (event) => {
    setIp(event.target.value);
  };

  function chooseTypeDevice(typeParam) {
    switch (typeParam) {
      case phone:
        return 'client';
      case server:
        return 'server';
      default:
        return 'switch';
    }
  }

  function saveEdge(edge, callback) {
    const customEdge = {
      ...edge,
      label: name,
      length: 300,
    };
    callback(customEdge);
  }

  function saveNode(node, callback) {
    const typeChoose = chooseTypeDevice(device);
    const customNode = {
      ...node,
      label: name,
      shape: 'image',
      image: device,
      size: 10,
      type: typeChoose,
    };
    if (device !== switchDivice) {
      customNode.ip = ip;
      setIp('');
    }
    callback(customNode);
  }

  function handleSubmit() {
    const { dataNode, callback } = data;

    if (data.type === 'node') {
      saveNode(dataNode, callback);
    } else {
      saveEdge(dataNode, callback);
    }
    setName('');
    setDevice('');
    setTypeDevice('');
    setOpen((x) => !x);
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
            {data.type}
          </DialogTitle>
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
                    value={device}
                    onChange={handleChange}
                    fullWidth
                  >
                    <MenuItem value={phone}>Device</MenuItem>
                    <MenuItem value={switchDivice}>Switch</MenuItem>
                    <MenuItem value={server}>Server</MenuItem>
                  </Select>
                </FormControl>

                {device && device !== switchDivice && (
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
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              {`${data.action} ${data.type}`}
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

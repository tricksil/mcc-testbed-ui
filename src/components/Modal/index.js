import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from 'react';
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
  Switch,
  FormGroup,
  FormControlLabel,
  Divider,
} from '@material-ui/core';

import phone from '~/assets/iphone.png';
import server from '~/assets/server.png';
import switchDivice from '~/assets/switch.png';
import { DeviceFactory } from '~/helpers/deviceFactory';
import { GraphContext } from '~/context/GraphContext';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    textTransform: 'capitalize',
  },
}));

const AddModal = forwardRef(({ data, setRemoveData }, ref) => {
  const { createNode, createEdge, addNodeRandom, editNode } = useContext(
    GraphContext
  );
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState('');
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [bandwidth, setBandwidth] = useState(0);
  const [delay, setDelay] = useState(0);
  const [quantity, setQuantity] = useState(5);
  const [bandwidthRandom, setBandwidthRandom] = useState(5);
  const [delayRandom, setDelayRandom] = useState(5);

  const [checked, setChecked] = useState(false);

  const toggleChecked = () => {
    setChecked((prev) => !prev);
  };

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

  const handleChangeDelay = (event) => {
    setDelay(event.target.value);
  };
  const handleChangeQuantity = (event) => {
    setQuantity(Number(event.target.value));
  };

  const handleChangeBandwidth = (event) => {
    setBandwidth(event.target.value);
  };
  const handleChangeDelayRandom = (event) => {
    setDelayRandom(event.target.value);
  };

  const handleChangeBandwidthRandom = (event) => {
    setBandwidthRandom(event.target.value);
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

  function saveEdge(edge) {
    const customEdge = {
      ...edge,
      label: name,
      bandwidth,
      delay,
    };
    createEdge(customEdge);
    setRemoveData();
  }

  function saveNode(node) {
    const typeChoose = chooseTypeDevice(device);
    const customNode = {
      ...node,
      label: name,
      shape: 'image',
      image: device,
      size: 15,
      type: typeChoose,
    };
    if (device !== switchDivice) {
      customNode.ip = ip;
      setIp('');
    }
    createNode(customNode);
    setRemoveData();
  }

  function editNodeModal(node) {
    const customNode = {
      ...node,
      label: name,
    };
    if (device !== switchDivice) {
      customNode.ip = ip;
      setIp('');
    }
    editNode(customNode);
    setRemoveData();
  }

  function addNodesAndEdge(node) {
    const typeChoose = chooseTypeDevice(device);
    const customNode = {
      shape: 'image',
      image: phone,
      size: 15,
      type: typeChoose,
    };
    const customEdge = {
      bandwidth: bandwidthRandom,
      delay: delayRandom,
    };
    const graph = DeviceFactory(node?.id, quantity, customEdge, customNode);
    addNodeRandom(graph);
    setRemoveData();
  }

  function handleSubmit() {
    const { dataNode } = data;

    if (checked) {
      addNodesAndEdge(dataNode);
    } else if (data.type === 'node' && data.action === 'add') {
      saveNode(dataNode);
    } else if (data.type === 'node' && data.action === 'edit') {
      editNodeModal(dataNode);
    } else if (data.type === 'edge') {
      saveEdge(dataNode);
    }

    setChecked(false);
    setDelayRandom(0);
    setBandwidthRandom(0);
    setQuantity(5);
    setDelay(0);
    setBandwidth(0);
    setName('');
    setDevice('');
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
              autoComplete="off"
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
                    disabled={data?.action === 'edit'}
                  >
                    <MenuItem value={phone}>Smartphone</MenuItem>
                    <MenuItem value={switchDivice}>Switch</MenuItem>
                    <MenuItem value={server}>Server</MenuItem>
                  </Select>
                </FormControl>

                {data?.action === 'edit' && (
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Switch
                          size="medium"
                          checked={checked}
                          onChange={toggleChecked}
                        />
                      }
                      label="add nodes"
                      labelPlacement="start"
                    />
                  </FormGroup>
                )}

                {checked && (
                  <>
                    <h3>Node</h3>
                    <TextField
                      margin="dense"
                      id="quantity"
                      label="Quantity"
                      type="number"
                      fullWidth
                      value={quantity}
                      onChange={handleChangeQuantity}
                      autoComplete="off"
                    />
                    <h3>Edge</h3>
                    <TextField
                      margin="dense"
                      id="delayRandom"
                      label="Delay"
                      type="number"
                      fullWidth
                      value={delayRandom}
                      onChange={handleChangeDelayRandom}
                      autoComplete="off"
                    />
                    <TextField
                      margin="dense"
                      id="bandwidthRandom"
                      label="Bandwidth"
                      type="number"
                      fullWidth
                      value={bandwidthRandom}
                      onChange={handleChangeBandwidthRandom}
                      autoComplete="off"
                    />
                  </>
                )}

                {device && device !== switchDivice && (
                  <>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="ip"
                      label="Ip Address"
                      type="text"
                      autoComplete="off"
                      fullWidth
                      value={ip}
                      onChange={handleChangeIp}
                    />
                  </>
                )}
              </>
            )}

            {data?.type === 'edge' && (
              <>
                <TextField
                  margin="dense"
                  id="delay"
                  label="Delay"
                  type="number"
                  fullWidth
                  value={delay}
                  onChange={handleChangeDelay}
                  autoComplete="off"
                />
                <TextField
                  margin="dense"
                  id="bandwidth"
                  label="Bandwidth"
                  type="number"
                  fullWidth
                  value={bandwidth}
                  onChange={handleChangeBandwidth}
                  autoComplete="off"
                />
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

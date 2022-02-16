/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-escape */
/* eslint-disable func-names */
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
} from '@material-ui/core';

import phone from '~/assets/phone.svg';
import server from '~/assets/server.svg';
import switchDivice from '~/assets/switch.svg';
import { createDimage } from '~/helpers/deviceFactory';
import { GraphContext } from '~/context/GraphContext';
import {
  emptyField,
  ipExistInNode,
  ipIncomplete,
  nameExistInNode,
} from '~/validation';
import IpMaskInput from '../IpMaskInput';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    textTransform: 'capitalize',
  },
}));

const AddModal = forwardRef(({ data, removeData }, ref) => {
  const { createNode, createEdge, graph } = useContext(GraphContext);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState('');
  const [name, setName] = useState('');
  const [ip, setIp] = useState('');
  const [bandwidth, setBandwidth] = useState('');
  const [delay, setDelay] = useState('');
  const [jitter, setJitter] = useState('');
  const [deviceError, setDeviceError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [ipError, setIpError] = useState(false);
  const [bandwidthError, setBandwidthError] = useState(false);
  const [delayError, setDelayError] = useState(false);
  const [jitterError, setJitterError] = useState(false);

  useImperativeHandle(ref, () => ({
    open: () => {
      setOpen((x) => !x);
    },
    close: () => {
      setOpen((x) => !x);
    },
  }));

  function clearStates() {
    setDelay('');
    setJitter('');
    setBandwidth('');
    setName('');
    setDevice('');
    setIp('');
    setDelayError(false);
    setJitterError(false);
    setBandwidthError(false);
    setNameError(false);
    setDeviceError(false);
    setIpError(false);
    setOpen((x) => !x);
  }

  const handleClose = () => {
    removeData();
    clearStates();
  };

  const handleChange = (event) => {
    setDevice(event.target.value);
    setDeviceError(false);
  };

  const handleChangeName = (event) => {
    setName(event.target.value.split(' ').join(''));
    setNameError(false);
  };
  const handleChangeIp = (event) => {
    setIp(event.target.value);
    setIpError(false);
  };

  const handleChangeDelay = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setDelay(value);
    if (value) {
      setDelayError(false);
    }
  };

  const handleChangeJitter = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setJitter(value);
    if (value) {
      setDelayError(false);
    }
  };

  const handleChangeBandwidth = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setBandwidth(value);
    if (value) {
      setBandwidthError(false);
    }
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
      bandwidth: Number(bandwidth),
      delay: `${delay}`,
      jitter: `${jitter}`,
      title: `Delay: ${delay}ms<br>Jitter: ${jitter}ms<br>Bandwidth: ${bandwidth}`,
    };
    createEdge(customEdge);
    removeData();
  }

  function saveNode(node) {
    const typeChoose = chooseTypeDevice(device);
    const nodeIndex = node.id.split('-')[0];
    const customNode = {
      ...node,
      id: nodeIndex,
      label: typeChoose !== 'switch' ? name : nodeIndex,
      title: `Type: ${
        typeChoose.charAt(0).toUpperCase() + typeChoose.slice(1)
      }<br>Name: ${typeChoose !== 'switch' ? name : nodeIndex}`,
      shape: 'image',
      image: device,
      size: 15,
      type: typeChoose,
    };
    if (device !== switchDivice) {
      customNode.ip = ip;
      customNode.title = `${customNode.title}<br>IP: ${ip}`;
      setIp('');
    }
    if (typeChoose !== 'switch') {
      customNode.dimage = createDimage(name)(typeChoose);
      customNode.title = `${customNode.title}<br>Image: ${customNode.dimage}`;
    }
    createNode(customNode);
    removeData();
  }

  function builderNodesAndEdge() {
    return function (dataNode) {
      if (data.type === 'node' && data.action === 'add') {
        saveNode(dataNode);
      } else if (data.type === 'edge' && data.action === 'add') {
        saveEdge(dataNode);
      }
    };
  }

  function validationNode() {
    let invalid = false;
    if (emptyField(device)) {
      setDeviceError(true);

      return true;
    }

    if (emptyField(name)) {
      setNameError(true);
      invalid = true;
    }

    if (nameExistInNode(name)) {
      setNameError(true);
      invalid = true;
    }
    console.log('ip', ipIncomplete(ip));
    if (emptyField(ip) || ipExistInNode(ip, graph) || ipIncomplete(ip)) {
      setIpError(true);
      invalid = true;
    }

    if (device === switchDivice) {
      return false;
    }

    return invalid;
  }

  function validationEdge() {
    let invalid = false;

    if (emptyField(delay)) {
      setDelayError(true);
      invalid = true;
    }

    if (emptyField(jitter)) {
      setJitterError(true);
      invalid = true;
    }

    if (emptyField(bandwidth)) {
      setBandwidthError(true);
      invalid = true;
    }

    return invalid;
  }

  function validation() {
    return data?.type === 'node' ? validationNode() : validationEdge();
  }

  function handleSubmit() {
    const { dataNode } = data;
    if (validation()) {
      return;
    }
    builderNodesAndEdge()(dataNode);
    clearStates();
  }

  function renderNode() {
    return (
      <>
        <FormControl className={classes.formControl} fullWidth margin="dense">
          <InputLabel id="type">Type</InputLabel>
          <Select
            labelId="type"
            id="type"
            value={device}
            onChange={handleChange}
            fullWidth
            disabled={data?.action === 'edit'}
            error={deviceError}
          >
            <MenuItem value={phone}>Smartphone</MenuItem>
            <MenuItem value={switchDivice}>Switch</MenuItem>
            <MenuItem value={server}>Server</MenuItem>
          </Select>
        </FormControl>

        {device && device !== switchDivice && (
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
            aria-autocomplete="none"
            error={nameError}
          />
        )}

        {device && device !== switchDivice && (
          <>
            <IpMaskInput
              onChange={setIp}
              value={ip}
              error={ipError}
              setError={setIpError}
              rangerAdd
            />
          </>
        )}
      </>
    );
  }

  function renderEdge() {
    return (
      <>
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
          aria-autocomplete="none"
        />
        <TextField
          margin="dense"
          id="delay"
          label="Delay(ms)"
          type="text"
          fullWidth
          value={delay}
          onChange={handleChangeDelay}
          autoComplete="off"
          aria-autocomplete="none"
          error={delayError}
        />
        <TextField
          margin="dense"
          id="jitter"
          label="Jitter(ms)"
          type="text"
          fullWidth
          value={jitter}
          onChange={handleChangeJitter}
          autoComplete="off"
          aria-autocomplete="none"
          error={jitterError}
        />
        <TextField
          margin="dense"
          id="bandwidth"
          label="Bandwidth"
          type="text"
          fullWidth
          value={bandwidth}
          onChange={handleChangeBandwidth}
          autoComplete="off"
          aria-autocomplete="none"
          error={bandwidthError}
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
            {data.type}
          </DialogTitle>
          <DialogContent>
            {data?.type === 'node' && renderNode()}
            {data?.type === 'edge' && renderEdge()}
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
  removeData: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default AddModal;

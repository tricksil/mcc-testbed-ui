import PropTypes from 'prop-types';
import { useState, forwardRef, useImperativeHandle, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { GraphContext } from '~context/GraphContext';
import { validationEdge, validationNode } from '~/validation';
import Edge from '../Edge';
import Node from '../Node';
import { saveEdge, saveNode } from '~/utils';
import CustomNetworkModal from '../CustomNetworkModal';

const useStyles = makeStyles((theme) => ({
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

  const handleChangeDevice = (event) => {
    setDevice(event.target.value);
    setDeviceError(false);
  };

  const handleChangeName = (event) => {
    setName(event.target.value.split(' ').join(''));
    setNameError(false);
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

  function builderNodesAndEdge() {
    return function (dataNode) {
      if (data.type === 'node' && data.action === 'add') {
        saveNode(dataNode, false, createNode, device, name, ip);
      } else if (data.type === 'edge' && data.action === 'add') {
        saveEdge(dataNode, createEdge, name, bandwidth, delay, jitter);
      }
      removeData();
    };
  }

  function validation() {
    return data?.type === 'node'
      ? validationNode(
          device,
          setDeviceError,
          name,
          setNameError,
          ip,
          graph,
          setIpError
        )
      : validationEdge(
          delay,
          setDelayError,
          jitter,
          setJitterError,
          bandwidth,
          setBandwidthError
        );
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
      <Node
        device={device}
        handleChangeDevice={handleChangeDevice}
        data={data}
        deviceError={deviceError}
        name={name}
        handleChangeName={handleChangeName}
        nameError={nameError}
        setIp={setIp}
        ip={ip}
        ipError={ipError}
        setIpError={setIpError}
      />
    );
  }

  function renderEdge() {
    return (
      <Edge
        name={name}
        handleChangeName={handleChangeName}
        delay={delay}
        handleChangeDelay={handleChangeDelay}
        delayError={delayError}
        jitter={jitter}
        handleChangeJitter={handleChangeJitter}
        jitterError={jitterError}
        bandwidth={bandwidth}
        handleChangeBandwidth={handleChangeBandwidth}
        bandwidthError={bandwidthError}
      />
    );
  }

  return (
    <>
      {open && (
        <CustomNetworkModal
          open={open}
          classes={classes}
          title={data.type}
          titleCancel="Cancel"
          titleSubmit={`${data.action} ${data.type}`}
          handleClose={handleClose}
          handleSubmit={handleSubmit}
          ContentComponent={
            <>
              {data?.type === 'node' && renderNode()}
              {data?.type === 'edge' && renderEdge()}
            </>
          }
        />
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

import PropTypes from 'prop-types';
import {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useContext,
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { GraphContext } from '~/context/GraphContext';
import { validationEdge, validationNodeEdit } from '~/validation';
import Edge from '../Edge';
import Node from '../Node';
import { saveEdge, saveNode, saveNodesAndEdge } from '~/utils';
import CustomNetworkModal from '../CustomNetworkModal';

const useStyles = makeStyles((theme) => ({
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
  title: {
    textTransform: 'capitalize',
  },
}));

const EditModal = forwardRef(({ data, removeData }, ref) => {
  const { addNodeRandom, editNode, editEdge, findEdge, graph } = useContext(
    GraphContext
  );
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [device, setDevice] = useState('');
  const [deviceChecked, setDeviceChecked] = useState('');
  const [name, setName] = useState('');
  const [nameCache, setNameCache] = useState('');
  const [ip, setIp] = useState('');
  const [ipCache, setIpCache] = useState('');
  const [bandwidth, setBandwidth] = useState('');
  const [delay, setDelay] = useState('');
  const [jitter, setJitter] = useState('');
  const [quantity, setQuantity] = useState('');
  const [bandwidthRandom, setBandwidthRandom] = useState('');
  const [jitterRandom, setJitterRandom] = useState('');
  const [delayRandom, setDelayRandom] = useState('');
  const [deviceCheckedError, setDeviceCheckedError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [ipError, setIpError] = useState(false);
  const [bandwidthError, setBandwidthError] = useState(false);
  const [delayError, setDelayError] = useState(false);
  const [jitterError, setJitterError] = useState(false);
  const [quantityError, setQuantityError] = useState(false);
  const [bandwidthRandomError, setBandwidthRandomError] = useState(false);
  const [delayRandomError, setDelayRandomError] = useState(false);
  const [jitterRandomError, setJitterRandomError] = useState(false);

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
    if (data.action === 'edit' && data.type === 'node') {
      const { label, image, ip: ipNode } = data.dataNode;
      setName(label);
      setNameCache(label);
      setDevice(image);
      if (ipNode) {
        setIp(ipNode);
        setIpCache(ipNode);
      }
    }
    if (data.action === 'edit' && data.type === 'edge') {
      const edge = findEdge(data.dataNode.id);
      data.dataNode = { ...data.dataNode, ...edge };
      setName(edge.label);
      setNameCache(edge.label);
      setBandwidth(edge.bandwidth);
      setDelay(
        !edge.delay?.includes('ms') ? edge.delay : edge.delay.replace('ms', '')
      );
      setJitter(
        !edge.jitter?.includes('ms')
          ? edge.jitter
          : edge.jitter.replace('ms', '')
      );
    }
  }, [data, data.action, data.type, findEdge]);

  const handleChangeDeviceCheck = (event) => {
    setDeviceChecked(event.target.value);
    setDeviceCheckedError(false);
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
      setJitterError(false);
    }
  };
  const handleChangeQuantity = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setQuantity(value);
    if (value) {
      setQuantityError(false);
    }
  };

  const handleChangeBandwidth = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setBandwidth(value);
    if (value) {
      setBandwidthError(false);
    }
  };
  const handleChangeDelayRandom = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setDelayRandom(value);
    if (value) {
      setDelayRandomError(false);
    }
  };
  const handleChangeJitterRandom = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setJitterRandom(value);
    if (value) {
      setJitterRandomError(false);
    }
  };

  const handleChangeBandwidthRandom = (event) => {
    const value = event.target.value.replace(/\D/g, '');
    setBandwidthRandom(value);
    if (value) {
      setBandwidthRandomError(false);
    }
  };

  function clearStates() {
    setChecked(false);
    setDelayRandom('');
    setJitterRandom('');
    setBandwidthRandom('');
    setQuantity('');
    setDelay('');
    setJitter('');
    setBandwidth('');
    setName('');
    setDevice('');
    setDeviceChecked('');
    setDeviceCheckedError(false);
    setNameError(false);
    setIpError(false);
    setBandwidthError(false);
    setDelayError(false);
    setJitterError(false);
    setQuantityError(false);
    setBandwidthRandomError(false);
    setDelayRandomError(false);
    setJitterRandomError(false);
    setOpen((x) => !x);
  }

  function builderNodesAndEdge(createNodesRandom) {
    return function (dataNetwork) {
      const { dataNode, action } = dataNetwork;
      if (createNodesRandom) {
        saveNodesAndEdge(
          dataNode,
          addNodeRandom,
          deviceChecked,
          bandwidthRandom,
          delayRandom,
          jitterRandom,
          graph,
          quantity
        );
      } else if (data.type === 'node') {
        saveNode(
          dataNode,
          action === 'edit',
          editNode,
          device,
          name,
          ip,
          setIp
        );
      } else if (data.type === 'edge') {
        saveEdge(dataNode, editEdge, name, bandwidth, delay, jitter);
      }
      removeData();
    };
  }

  function validation() {
    return data?.type === 'node'
      ? validationNodeEdit(
          device,
          name,
          nameCache,
          setNameError,
          ip,
          checked,
          setIpError,
          deviceChecked,
          setDeviceCheckedError,
          quantity,
          setQuantityError,
          delayRandom,
          setDelayRandomError,
          jitterRandom,
          setJitterRandomError,
          bandwidthRandom,
          setBandwidthRandomError,
          graph
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
    if (validation()) {
      return;
    }
    builderNodesAndEdge(checked)(data);
    clearStates();
  }

  const handleClose = () => {
    removeData();
    clearStates();
  };

  function renderNode() {
    return (
      <Node
        device={device}
        data={data}
        name={name}
        handleChangeName={handleChangeName}
        nameError={nameError}
        setIp={setIp}
        ip={ip}
        ipError={ipError}
        setIpError={setIpError}
        ipCache={ipCache}
        edit={data.action === 'edit'}
        checked={checked}
        toggleChecked={toggleChecked}
        quantity={quantity}
        handleChangeQuantity={handleChangeQuantity}
        quantityError={quantityError}
        deviceChecked={deviceChecked}
        handleChangeDeviceCheck={handleChangeDeviceCheck}
        deviceCheckedError={deviceCheckedError}
        delayRandom={delayRandom}
        handleChangeDelayRandom={handleChangeDelayRandom}
        delayRandomError={delayRandomError}
        jitterRandom={jitterRandom}
        handleChangeJitterRandom={handleChangeJitterRandom}
        jitterRandomError={jitterRandomError}
        bandwidthRandom={bandwidthRandom}
        handleChangeBandwidthRandom={handleChangeBandwidthRandom}
        bandwidthRandomError={bandwidthRandomError}
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

EditModal.displayName = 'EditModal';

EditModal.propTypes = {
  removeData: PropTypes.func.isRequired,
  data: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

export default EditModal;

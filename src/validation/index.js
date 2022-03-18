import { ipExist, nameExist } from '~/utils/helpers/deviceFactory';

import switchDevice from '~/assets/switch.svg';
import phone from '~/assets/phone.svg';

export function emptyField(value) {
  return (
    !value || (Object.keys(value).length === 0 && value.constructor === Object)
  );
}

export function ipIncomplete(value) {
  const arrayValue = value.split('.');
  return arrayValue.length !== 4 || !arrayValue[3];
}

export function ipExistInNode(ip, graph) {
  return ipExist(ip, graph);
}
export function nameExistInNode(name, graph) {
  return nameExist(name, graph);
}

export function validationNode(
  device,
  setDeviceError,
  name,
  setNameError,
  ip,
  graph,
  setIpError
) {
  let invalid = false;
  if (emptyField(device)) {
    setDeviceError(true);

    return true;
  }

  if (emptyField(name)) {
    setNameError(true);
    invalid = true;
  }

  if (nameExistInNode(name, graph)) {
    setNameError(true);
    invalid = true;
  }

  if (emptyField(ip) || ipExistInNode(ip, graph) || ipIncomplete(ip)) {
    setIpError(true);
    invalid = true;
  }

  if (device === switchDevice) {
    return false;
  }

  return invalid;
}

export function validationNodeEdit(
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
) {
  let invalid = false;
  if (device !== switchDevice) {
    if (
      emptyField(name) ||
      (name !== nameCache && nameExistInNode(name, graph))
    ) {
      setNameError(true);
      invalid = true;
    }

    if (emptyField(ip)) {
      setIpError(true);
      invalid = true;
    }
    if (ipIncomplete(ip)) {
      setIpError(true);
      invalid = true;
    }
  }

  if (device !== phone && checked) {
    if (emptyField(deviceChecked)) {
      setDeviceCheckedError(true);

      invalid = true;
    }

    if (emptyField(quantity)) {
      setQuantityError(true);
      invalid = true;
    }

    if (emptyField(delayRandom)) {
      setDelayRandomError(true);
      invalid = true;
    }

    if (emptyField(jitterRandom)) {
      setJitterRandomError(true);
      invalid = true;
    }

    if (emptyField(bandwidthRandom)) {
      setBandwidthRandomError(true);
      invalid = true;
    }
  }

  return invalid;
}

export function validationEdge(
  delay,
  setDelayError,
  jitter,
  setJitterError,
  bandwidth,
  setBandwidthError
) {
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

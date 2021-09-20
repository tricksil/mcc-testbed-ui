import { ipExist } from '~/helpers/deviceFactory';

export function emptyField(value) {
  return (
    !value || (Object.keys(value).length === 0 && value.constructor === Object)
  );
}
export function ipExistInNode(ip, graph) {
  return ipExist(ip, graph);
}

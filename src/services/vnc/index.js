import axios from 'axios';

export default {
  vncStatus: (ip, vncPort) =>
    axios.get(`http://${ip}:${vncPort}/vnc_auto.html`),
  getVncPort: (ip, name) => axios.get(`http://${ip}:5000/vnc/${name}`),
};

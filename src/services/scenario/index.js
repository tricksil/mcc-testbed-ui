import axios from 'axios';

export default {
  apiStatus: (ip) => axios.get(`http://${ip}:5000/status`),
  getAllScenario: (ip) => axios.get(`http://${ip}:5000/scenarios/list`),
  stopScenario: (ip) => axios.get(`http://${ip}:5000/stop`),
  executionScenerio: (ip, scenerioTestbed) =>
    axios.post(`http://${ip}:5000/create`, scenerioTestbed),
  saveScenario: (ip, name, scenerioTestbed) =>
    axios.post(`http://${ip}:5000/scenarios/${name}`, scenerioTestbed),
};

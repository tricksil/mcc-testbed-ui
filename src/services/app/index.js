import axios from 'axios';

export default {
  getAllApk: (ip) => axios.get(`http://${ip}:5000/apks/list`),
  getAllLogs: (ip) => axios.get(`http://${ip}:5000/exec/logs`),
  saveApk: (ip, name, formData) =>
    axios.post(`http://${ip}:5000/apks/${name}.apk`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
      },
    }),
  executionStatus: async (ip, setExecApkStatus) => {
    try {
      const { data } = await axios.get(`http://${ip}:5000/exec/status`);
      if (data.code === 200) {
        setExecApkStatus(data.message);
      }
      // eslint-disable-next-line no-empty
    } catch (error) {}
  },
  executionClean: (ip) => axios.get(`http://${ip}:5000/exec/clean`),
  executionApk: (ip, data) => axios.post(`http://${ip}:5000/exec`, data),
};

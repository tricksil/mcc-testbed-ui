import axios from 'axios';

async function execStatus(ip, setExecApkStatus) {
  try {
    const { data } = await axios.get(`http://${ip}:5000/exec/status`);
    if (data.code === 200) {
      setExecApkStatus(data.message);
      console.log(data);
    }
  } catch (error) {
    console.log(error);
  }
}

export { execStatus };

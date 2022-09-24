import { boot } from 'quasar/wrappers';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/';

export default boot(({ app, router }) => {
  let refresh = false;

  axios.interceptors.response.use(
    (resp) => resp,
    async (error) => {
     
      if (error.response.status === 401 && !refresh) {
        refresh = true;
        const { status, data } = await axios.post(
          'auth/refresh',
          {},
          {
            withCredentials: true,
          }
        );

        if (status === 202) {
         
          axios.defaults.headers.common['Authorization'] =
            'Bearer ' + data.access_token;

          return axios(error.config);
        } else router.push('/login');
      }
      refresh = false;
      return error;
    }
  );

  app.config.globalProperties.$axios = axios;
});

export { axios };

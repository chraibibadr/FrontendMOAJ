import { boot } from 'quasar/wrappers';
import axios from 'axios';
import { useIsAuthenticated } from 'src/stores/isAuthenticated';
import { Notify } from 'quasar';

axios.defaults.baseURL = 'http://localhost:3000/';

export default boot(() => {
  const store = useIsAuthenticated();

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

          console.log('SET TRUE (AXOIS)');

          store.setIsAuthenticated(true);

          return axios(error.config);
        } else {
          console.log('SET FALSE (AXIOS)');
          store.setIsAuthenticated(false);
        }
      }

      if (error.response.status === 403) {
        if (error.response.data['message'] == 'Bad User')
          Notify.create({
            message:
              "Le nom d'utilisateur ou l'adresse e-mail que vous avez saisie n'est pas associée à un compte.",
            type: 'negative',
            multiLine: true,
            position: 'top',
          });
        if (error.response.data['message'] == 'Bad Credentials')
          Notify.create({
            message: 'Le mot de passe entré est incorrect.',
            type: 'negative',
            multiLine: true,
            position: 'top',
          });
      }

      refresh = false;
      return error;
    }
  );
});

export { axios };

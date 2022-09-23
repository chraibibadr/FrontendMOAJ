import axios from 'axios';
import { boot } from 'quasar/wrappers';
import { useIsAuthenticated } from 'src/stores/isAuthenticated';

let logout;

export default boot(async ({ router }) => {
  const store = useIsAuthenticated();

  logout = async () => {
    await axios.post('auth/logout', {}, { withCredentials: true });
    axios.defaults.headers.common['Authorization'] = '';

    store.setIsAuthenticated(false);
    store.setIsAdmin(false);
    store.setPermissions(['']);
    store.setUsername('');

    console.log('SET TO FALSE FROM BOOT FILE');

    await router.push('/login');
  };
});

export { logout };

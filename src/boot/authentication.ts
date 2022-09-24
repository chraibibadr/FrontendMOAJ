import { boot } from 'quasar/wrappers';
import { useIsAuthenticated } from 'src/stores/isAuthenticated';

export default boot(({ router }) => {
  router.beforeEach(async (to, from, next) => {
    const store = useIsAuthenticated();
    console.log(
      '-------------------------------------------------------------'
    );

    console.log('BEFORE (getIsAuthenticated): ', store.getIsAuthenticated);
    console.log('BEFORE (getPermissions): ', store.getPermissions);
    console.log('BEFORE (getIsAdmin): ', store.getIsAdmin);
    console.log('BEFORE (getUsername): ', store.getUsername);

    if (!store.getIsAuthenticated) await store.loadData();

    console.log('AFTER (getIsAuthenticated): ', store.getIsAuthenticated);
    console.log('AFTER (getPermissions): ', store.getPermissions);
    console.log('AFTER (getIsAdmin): ', store.getIsAdmin);
    console.log('AFTER (getUsername): ', store.getUsername);

    let permit = false;

    // isAuthenticated case
    if (to.matched.some((record) => record.meta.isAuthenticated)) {
      // check if user is Authenticated
      if (store.getIsAuthenticated) {
        permit = true; // user is Authenticated : permit access
      } else {
        // user is not Authenticated
        router.push('/login');
      }
    } else {
      permit = true; // no meta required : permit access
    }

    // isAdmin case
    if (to.matched.some((record) => record.meta.isAdmin)) {
      // check if user is Admin
      if (store.getIsAdmin) {

        /**********updated by smyej**************** */
        
        store.setPermissions(['App1','App2','App3','App4'])
        permit = true; // user is Admin : permit access
      } else {
        // App1 permission case
        if (to.matched.some((record) => record.meta.App1)) {
          // check if user has permission App1
          if (store.getPermissions.includes('App1')) {
            permit = true; // user has permission App1 : permit access
          } else {
            router.push(from.fullPath); // user has not permission App1 : stay on 'from' page
          }
        } else {
          permit = true; // no meta required : permit access
        }

        // App2 permission case
        if (to.matched.some((record) => record.meta.App2)) {
          // check if user has permission App2
          if (store.getPermissions.includes('App2')) {
            permit = true; // user has permission App2 : permit access
          } else {
            router.push(from.fullPath); // user has not permission App2 : stay on 'from' page
          }
        } else {
          permit = true; // no meta required : permit access
        }

        // App3 permission case
        if (to.matched.some((record) => record.meta.App3)) {
          // check if user has permission App3
          if (store.getPermissions.includes('App3')) {
            permit = true; // user has permission App3 : permit access
          } else {
            router.push(from.fullPath); // user has not permission App3 : stay on 'from' page
          }
        } else {
          permit = true; // no meta required : permit access
        }

        // App4 permission case
        if (to.matched.some((record) => record.meta.App4)) {
          // check if user has permission App4
          if (store.getPermissions.includes('App4')) {
            permit = true; // user has permission App4 : permit access
          } else {
            router.push(from.fullPath); // user has not permission App4 : stay on 'from' page
          }
        } else {
          permit = true; // no meta required : permit access
        }
        // user is not Admin : stay on 'from' page
        router.push(from.fullPath);
      }
    } else {
      permit = true; // no meta required : permit access
    }

    // check if permited
    if (permit) {
      // check if Authenticated user try to access login page
      if (store.getIsAuthenticated && to.name == 'login')
        router.push(from.fullPath); // user is Authenticated : stay on 'from' page
      next();
    }
  });
});

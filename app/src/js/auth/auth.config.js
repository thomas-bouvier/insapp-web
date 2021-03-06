function AuthConfig($stateProvider, $httpProvider) {
    'ngInject';
  
    $stateProvider
  
    .state('app.login', {
      url: '/login',
      controller: 'AuthController as $controller',
      templateUrl: '/auth/auth.html',
      title: 'Login',
      resolve: {
        auth: User => {
          return User.ensureAuthIs(false)
        }
      }
    })
  }
  
  export default AuthConfig
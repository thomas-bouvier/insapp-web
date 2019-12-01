import angular from 'angular'

import './config/app.templates'
import './layout'
import './directives'
import './components'
import './services'
import './post'
import './auth'

import 'angular-route'
import 'angular-resource'
import 'angular-ui-bootstrap'
import 'angular-ui-bootstrap-datetimepicker'
import 'ng-dialog'
import 'ng-file-upload'
import 'ng-loading-overlay'
import 'angular-ui-router'
import AppConstants from './config/app.config'

const requires = [
  'templates',
  'ngResource',
  'ngDialog',
  'ngFileUpload',
  'ngLoadingOverlay',
  'ui.router',
  'ui.bootstrap',
  'ui.bootstrap.datetimepicker',
  'app.layout',
  'app.services',
  'app.directives',
  'app.components',
  'app.auth',
  'app.postcreate',
  'app.postlist'
]

let app = angular.module('app', requires)

app.constant('AppConstants', AppConstants)
app.config(AppConfig)
app.run(AppRun)

function AppConfig($httpProvider, $stateProvider, $urlRouterProvider) {
  'ngInject'

  // Auth middleware
  $httpProvider.interceptors.push(($state, $q) => {
    return {
      // Handle 401
      responseError: rejection => {
        if (rejection.status === 401 || rejection.status === 403) {
          $state.go('app.login')
        }

        return $q.reject(rejection)
      }
    }
  })

  $stateProvider.state('app', {
    abstract: true,
    templateUrl: '/layout/app-view.html',
    resolve: {
      auth: User => {
        return User.verifyAuth()
      }
    }
  })

  $urlRouterProvider.otherwise('/login')
}

function AppRun(AppConstants, $rootScope) {
  'ngInject'

  // Change page title based on state
  $rootScope.$on('$stateChangeSuccess', toState => {
    $rootScope.setPageTitle(toState.title)
  })

  // Helper method for setting the page title
  $rootScope.setPageTitle = (title) => {
    $rootScope.pageTitle = ''

    if (title) {
      $rootScope.pageTitle += title;
      $rootScope.pageTitle += ' \u2014 '
    }

    $rootScope.pageTitle += AppConstants.appName
  }
}
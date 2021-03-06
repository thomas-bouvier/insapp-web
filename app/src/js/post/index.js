import angular from 'angular'

// Post list module
let postListModule = angular.module('app.postlist', [])

import PostListConfig from './list.config'
postListModule.config(PostListConfig)

import PostListController from './list.controller'
postListModule.controller('PostListController', PostListController)

// Post create module
let postCreateModule = angular.module('app.postcreate', [])

import PostCreateConfig from './create.config'
postCreateModule.config(PostCreateConfig)

import PostCreateController from './create.controller'
postCreateModule.controller('PostCreateController', PostCreateController)

// Post view module
let postViewModule = angular.module('app.postview', [])

import PostViewConfig from './view.config'
postViewModule.config(PostViewConfig)

import PostViewController from './view.controller'
postViewModule.controller('PostViewController', PostViewController)

// Post validate module
let postValidateModule = angular.module('app.postvalidate', [])

import PostValidateConfig from './validate.config'
postValidateModule.config(PostValidateConfig)

import PostValidateController from './validate.controller'
postValidateModule.controller('PostValidateController', PostValidateController)

export { 
  postListModule,
  postCreateModule,
  postViewModule,
  postValidateModule
}

'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // 注意環境屬性盡量是用大寫。由於插到程式碼內預設為變數，如果是要字串要多加雙引號
  APIPATH: '"https://vue-course-api.hexschool.io"',
  CUSTOMPATH: '"dat"',
});

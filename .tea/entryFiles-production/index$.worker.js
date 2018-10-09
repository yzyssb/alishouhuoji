require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../pages/oppen-door/oppen-door');
require('../../pages/orderDetail/orderDetail');
require('../../pages/orderList/orderList');
require('../../pages/have-opened/have-opened');
require('../../pages/passwordLogin/passwordLogin');
require('../../pages/mobileRegister/mobileRegister');
require('../../pages/mobileLogin/mobileLogin');
require('../../pages/newMobileLogin/newMobileLogin');
require('../../pages/machine/machine');
require('../../pages/onekeyLogin/onekeyLogin');
require('../../pages/my/my');
require('../../pages/todos/todos');
require('../../pages/add-todo/add-todo');
require('../../pages/scan-code/scan-code');
require('../../pages/agreement/agreement');
require('../../pages/appealList/appealList');
require('../../pages/afterSale/afterSale');
require('../../pages/limit-user/limit-user');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();

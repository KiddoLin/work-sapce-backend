import { Router } from 'express';

import {apiAuth} from '../../utils/authorize';
import * as Qiniu from './qiniu';
import * as Sessions from './sessions';
import * as Spaces from './spaces';
import * as Offices from './offices';
import * as Meetingrooms from './meetingrooms';
//import * as Officeorders from './office_orders';
//import * as Meetingroomorders from './meetingroom_orders';
import * as Orders from './orders';
import * as Users from './users';
import * as Dashboard from './dashboard';
import * as SpaceAdmins from './space_admins';
import * as MoneyTranses from './money_transes';
import * as Appointments from './appointments';
import * as Holidays from './holidays';
import * as Qqmap from './qqmap';
import * as Qrcodes from './qrcodes';
import * as Promotions from './promotions';
import * as PromotionOrders from './promotion_orders';
// import * as Questions from './questions';
// import * as Messages from './messages';
// import * as Qiniu from './qiniu';
// import * as Search from './search';
// import passport from 'passport';
const router = new Router();

// Get all Posts
//router.route('/movies').get(Movies.getMovies);

// Get one post by title
//router.route('/movies/:id').get(Movies.getMovie);

// //router.route('/test/next').get(Movies.getNextUserId);
// router.route('/signup').post(Users.signup);
router.post('/session/login', Sessions.login);
router.post('/session/logout', Sessions.logout);
router.get('/session', apiAuth, Sessions.current);

router.get('/dashboard', apiAuth, Dashboard.statCount);

router.get('/qiniu/token', apiAuth, Qiniu.genToken);

router.get('/spaces', apiAuth, Spaces.list);
router.get('/spaces/:id', apiAuth, Spaces.get);
router.post('/spaces', apiAuth, Spaces.create);
router.put('/spaces/:id', apiAuth, Spaces.update);
router.patch('/spaces/:id', apiAuth, Spaces.patch);
router.delete('/spaces/:id', apiAuth, Spaces.remove);
//router.get('/spaces/:id/qrcode', Spaces.genQrcode);
router.get('/spaces/:id/omrs', apiAuth, Spaces.listOmrs);

router.get('/offices', apiAuth, Offices.list);
router.get('/offices/:id', apiAuth, Offices.get);
router.post('/offices', apiAuth, Offices.create);
router.put('/offices/:id', apiAuth, Offices.update);
router.patch('/offices/:id', apiAuth, Offices.patch);
router.delete('/offices/:id', apiAuth, Offices.remove);

router.get('/meetingrooms', apiAuth, Meetingrooms.list);
router.get('/meetingrooms/:id', apiAuth, Meetingrooms.get);
router.post('/meetingrooms', apiAuth, Meetingrooms.create);
router.put('/meetingrooms/:id', apiAuth, Meetingrooms.update);
router.patch('/meetingrooms/:id', apiAuth, Meetingrooms.patch);
router.delete('/meetingrooms/:id', apiAuth, Meetingrooms.remove);

//router.get('/orders/office', apiAuth, Officeorders.list);
//router.get('/orders/office/:id', apiAuth, Officeorders.get);

//router.get('/orders/meetingroom', apiAuth, Meetingroomorders.list);
//router.get('/orders/meetingroom/:id', apiAuth, Meetingroomorders.get);

router.get('/orders', apiAuth, Orders.list);
router.get('/orders/:id', apiAuth, Orders.get);

router.get('/users', apiAuth, Users.list);
router.get('/users/:id', apiAuth, Users.get);
router.patch('/users/:id', apiAuth, Users.patch);

router.get('/space_admins', apiAuth, SpaceAdmins.list);
router.get('/space_admins/:id', apiAuth, SpaceAdmins.get);
router.post('/space_admins', apiAuth, SpaceAdmins.create);
router.put('/space_admins/:id', apiAuth, SpaceAdmins.update);
router.patch('/space_admins/:id', apiAuth, SpaceAdmins.patch);

router.get('/money_transes', apiAuth, MoneyTranses.list);
router.get('/money_transes/export/excel', MoneyTranses.exportExcel);

router.get('/appointments', apiAuth, Appointments.list);
router.get('/appointments/:id', apiAuth, Appointments.get);

router.get('/holidays', apiAuth, Holidays.list);
router.get('/holidays/:id', apiAuth, Holidays.get);
router.post('/holidays', apiAuth, Holidays.create);
router.put('/holidays/:id', apiAuth, Holidays.update);
router.delete('/holidays/:id', apiAuth, Holidays.remove);

router.get('/mapstat', apiAuth, Qqmap.getMapStat);

router.get('/qrcodes/gen',  apiAuth, Qrcodes.genQrcode);

router.get('/promotions', apiAuth, Promotions.list);
router.post('/promotions', apiAuth, Promotions.create);
router.get('/promotions/:id', apiAuth, Promotions.get);
router.put('/promotions/:id', apiAuth, Promotions.update);
router.delete('/promotions/:id', apiAuth, Promotions.remove);
router.delete('/promotions/:id/details/:did', apiAuth, Promotions.removeDetail);
router.post('/promotions/:id/details', apiAuth, Promotions.addDetail);

router.get('/promotion_orders', apiAuth, PromotionOrders.list);
router.get('/promotion_orders/:id', apiAuth, PromotionOrders.get);
router.put('/promotion_orders/:id', apiAuth, PromotionOrders.update);

export default router;

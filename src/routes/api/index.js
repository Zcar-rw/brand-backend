import express from 'express';
import cars from './cars';
import types from './types';
import makes from './makes';
import models from './models';
import users from './users';
import notifications from './notifications';
import suppliers from './suppliers';
import roles from './roles';
import companies from './companies';
import files from './files';
import inquiry from './inquiry';
import booking from './booking';

const router = express.Router();

router.use('/cars', cars);
router.use('/types', types);
router.use('/makes', makes);
router.use('/models', models);
router.use('/users', users);
router.use('/notifications', notifications);
router.use('/suppliers', suppliers);
router.use('/roles', roles);
router.use('/companies', companies);
router.use('/files', files);
router.use('/inquiry', inquiry);
router.use('/booking', booking);

export default router;

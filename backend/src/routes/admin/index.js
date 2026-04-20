const express = require('express');
const categoriesRouter = require('./categories');
const newsRouter = require('./news');
const galleryRouter = require('./gallery');
const slidersRouter = require('./sliders');
const usersRouter = require('./users');
const rolesRouter = require('./roles');
const permissionsRouter = require('./permissions');
const contactSubmissionsRouter = require('./contact-submissions');
const employeesRouter = require('./employees');
const dataRouter = require('./data');
const farmersRouter = require('./farmers');
const irrigationProfilesRouter = require('./irrigation-profiles');

const router = express.Router();

router.use('/categories', categoriesRouter);
router.use('/news', newsRouter);
router.use('/gallery', galleryRouter);
router.use('/sliders', slidersRouter);
router.use('/users', usersRouter);
router.use('/roles', rolesRouter);
router.use('/permissions', permissionsRouter);
router.use('/contact-submissions', contactSubmissionsRouter);
router.use('/employees', employeesRouter);
router.use('/data', dataRouter);
router.use('/farmers', farmersRouter);
router.use('/irrigation-profiles', irrigationProfilesRouter);

module.exports = router;
import express from "express";
import apiRouter from "./api/api.js";
import adminPageRouter from './frontend/admin_page.js';
import webPageRouter from "./frontend/web_page.js";
import testRouter from "./test/test.js";
import testApiRouter from "./test/test_api.js";

const router = express.Router();
router.use('/api', apiRouter);
router.use('/admin',adminPageRouter);
router.use('/test', testRouter);
router.use('/test-api', testApiRouter);
router.use('/', webPageRouter);

export default router;
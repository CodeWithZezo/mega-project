import express from "express";

const router = express.Router();

router.post('/signup',signupController)

export default router;  
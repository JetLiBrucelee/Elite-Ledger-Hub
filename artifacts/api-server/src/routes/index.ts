import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import plansRouter from "./plans";
import chatRouter from "./chat";
import adminRouter from "./admin";
import userRouter from "./user";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(plansRouter);
router.use(chatRouter);
router.use(adminRouter);
router.use(userRouter);

export default router;

import * as e from 'express';

// Routes
import { default as Photo } from './Photo';
import { default as User } from './User';
// import { default as Competition } from './Competition';
import { default as Color } from './Color';

const router = e.Router();
router.use(Photo);
router.use(User);
// router.use(Competition);
router.use(Color);

export default router;
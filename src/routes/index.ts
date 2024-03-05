import * as e from 'express';

// Routes
import { default as Photo } from './Photo';
import { default as User } from './User';
// import { default as Competition } from './Competition';

const router = e.Router();
router.use(Photo);
router.use(User);
// router.use(Competition);

export default router;
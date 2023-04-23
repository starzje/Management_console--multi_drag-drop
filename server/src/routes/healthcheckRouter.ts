import { Router} from 'express';

const router = Router();

router.get('/', async (req, res, next) => res.send({ success: true, message: "It is working" }));

export default router;

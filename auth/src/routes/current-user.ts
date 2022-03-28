import express from 'express';
import { currentUser } from '@phticketing/common';

const router = express.Router();

router.get('/api/users/currentuser', currentUser, (req, res) => {
  console.log('here in current user endpoint');
  res.send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };

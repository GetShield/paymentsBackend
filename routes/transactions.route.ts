import authorize from '../middlewares/authorize';
import logRequest from '../middlewares/logRequest';

import express from 'express';
const router = express.Router();

import transactionsController from '../controllers/transactions.controller';

router.get(
  '/',
  authorize,
  logRequest,
  transactionsController.getAllTransactions
);

router.get(
  '/ramp/get-by-current-user',
  authorize,
  logRequest,
  transactionsController.getByCurrentUserFromRamp
);

router.get(
  '/get-not-synced-by-current-user',
  authorize,
  logRequest,
  transactionsController.getNotSyncedByCurrentUser
);

router.post(
  '/sync-by-current-user',
  authorize,
  logRequest,
  transactionsController.syncByCurrentUser
);

router.post(
  '/sync-mock-transactions-by-current-user',
  authorize,
  logRequest,
  transactionsController.syncMockTransactionsByCurrentUser
);

export default router;

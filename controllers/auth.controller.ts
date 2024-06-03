import { Request, Response } from 'express';
import logger from 'node-color-log';

import { NewUser } from '../types';
import { DebitCardService } from '../services/debit-cards.service';
import UserModel from '../models/user.model';
import { JWT_SECRET } from '../config';
import { handleHttpError } from '../utils';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const secretKey = JWT_SECRET;

export default {
  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await UserModel.findOne({ email: email });

      if (!user) {
        res.status(401).send({ error: 'Invalid credentials.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        res.status(401).send({ error: 'Invalid credentials.' });
        return;
      }

      const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '3h' });

      const response = {
        _id: user._id,
        user_name: user.user_name,
        email: user.email,
        token,
      };

      res.send(response);
    } catch (error) {
      handleHttpError(error, res);
    }
  },

  async register(req: Request, res: Response) {
    try {
      const { email, password, user_name } = req.body;

      const alreadyExists = await UserModel.findOne({ email: email });

      if (alreadyExists) {
        handleHttpError(new Error('Email already taken.'), res, 409);
        return;
      }

      logger.info({ email, password, user_name });

      const salt = bcrypt.genSaltSync(10);
      const hashed_password = bcrypt.hashSync(password, salt);

      const newUser: NewUser = {
        email: email,
        password: hashed_password,
        user_name: user_name,
        wallets: [],
      };
      const user = new UserModel(newUser);
      await user.save();

      await DebitCardService.create({
        userId: user._id.toString(),
        rampUserId: '',
        userName: user_name,
        userEmail: email,
        card1: JSON.stringify({
          cardNumber: '',
          cardName: '',
          cardExpiry: '',
          cardCVV: '',
        }),
      });

      const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });

      res.json({ _id: user._id, user_name, email, token });
    } catch (error) {
      handleHttpError(error, res);
    }
  },
};

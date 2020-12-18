import User from '../models/User';
import {
  getOne,
} from './handlerFactory';

const getProfiles = getOne(User);

export {
  getProfiles,
};

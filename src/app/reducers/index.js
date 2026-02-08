import { combineReducers } from 'redux';

import user from './user';
import movies from './movies';
import producers from './producers';

export default combineReducers({
  user,
  movies,
  producers
});

import * as pages from './pages';
import config from 'config';

const result = {
  [pages.defaultPage]: `${config.UI_URL_PREFIX}/${pages.defaultPage}`,
  [pages.login]: `${config.UI_URL_PREFIX}/${pages.login}`,
  [pages.secretPage]: `${config.UI_URL_PREFIX}/${pages.secretPage}`,
  [pages.moviesList]: `${config.UI_URL_PREFIX}/${pages.moviesList}`,
  [pages.movieDetail]: `${config.UI_URL_PREFIX}/${pages.movieDetail}`,
  [pages.producersList]: `${config.UI_URL_PREFIX}/${pages.producersList}`,
  [pages.producerDetail]: `${config.UI_URL_PREFIX}/${pages.producerDetail}`,
};

export default result;

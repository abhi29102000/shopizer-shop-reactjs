import axios from 'axios';
import { getLocalData } from '../../util/helper';

export const FETCH_RECENTLY_VIEWED = 'FETCH_RECENTLY_VIEWED';
export const SET_RECENTLY_VIEWED = 'SET_RECENTLY_VIEWED';

const BASE_URL = window._env_.APP_BASE_URL + window._env_.APP_API_VERSION;

const getSessionId = () => {
  let id = localStorage.getItem('sessionId');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('sessionId', id);
  }
  return id;
};

const getHeaders = () => {
  const token = localStorage.getItem('token');
  console.log('[RecentlyViewed] token in localStorage:', token ? token.substring(0, 30) + '...' : 'NULL');
  return {
    'X-Session-Id': getSessionId(),
    ...(token ? { 'Authorization': 'Bearer ' + token } : {})
  };
};

export const recordView = (productId) => () => {
  axios.post(`${BASE_URL}products/${productId}/view`, null, { headers: getHeaders() })
    .catch(() => {}); // fire & forget
};

export const fetchRecentlyViewed = () => async (dispatch) => {
  dispatch({ type: FETCH_RECENTLY_VIEWED });
  try {
    const response = await axios.get(`${BASE_URL}customer/recently-viewed`, { headers: getHeaders() });
    console.log('[RecentlyViewed] API response:', response.status, response.data);
    dispatch({ type: SET_RECENTLY_VIEWED, payload: response.data });
  } catch (e) {
    console.error('[RecentlyViewed] API error:', e.response?.status, e.message);
    dispatch({ type: SET_RECENTLY_VIEWED, payload: [] });
  }
};

import axios from 'axios';

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

const sessionHeaders = () => ({ 'X-Session-Id': getSessionId() });

export const recordView = (productId) => () => {
  axios.post(`${BASE_URL}products/${productId}/view`, null, { headers: sessionHeaders() })
    .catch(() => {}); // fire & forget
};

export const fetchRecentlyViewed = () => async (dispatch) => {
  dispatch({ type: FETCH_RECENTLY_VIEWED });
  try {
    const response = await axios.get(`${BASE_URL}customer/recently-viewed`, { headers: sessionHeaders() });
    dispatch({ type: SET_RECENTLY_VIEWED, payload: response.data });
  } catch (e) {
    dispatch({ type: SET_RECENTLY_VIEWED, payload: [] });
  }
};

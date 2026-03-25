import axios from 'axios';

export const FETCH_RECENTLY_VIEWED = 'FETCH_RECENTLY_VIEWED';
export const SET_RECENTLY_VIEWED = 'SET_RECENTLY_VIEWED';

const getSessionId = () => {
  let id = localStorage.getItem('sessionId');
  if (!id) {
    id = Math.random().toString(36).substring(2) + Date.now().toString(36);
    localStorage.setItem('sessionId', id);
  }
  return id;
};

export const recordView = (productId) => () => {
  axios.post(`products/${productId}/view`, null, {
    headers: { 'X-Session-Id': getSessionId() }
  }).catch(() => {});
};

export const fetchRecentlyViewed = () => async (dispatch) => {
  dispatch({ type: FETCH_RECENTLY_VIEWED });
  try {
    const token = localStorage.getItem('token');
    const headers = { 'X-Session-Id': getSessionId() };
    if (token) headers['Authorization'] = 'Bearer ' + token;

    const response = await axios.get('customer/recently-viewed', {
      params: { store: 'DEFAULT', lang: 'en' },
      headers
    });
    dispatch({ type: SET_RECENTLY_VIEWED, payload: response.data });
  } catch (e) {
    dispatch({ type: SET_RECENTLY_VIEWED, payload: [] });
  }
};

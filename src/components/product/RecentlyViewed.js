import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchRecentlyViewed } from '../../redux/actions/recentlyViewedActions';

const RecentlyViewed = () => {
  const dispatch = useDispatch();
  const recentlyViewed = useSelector(state => state.recentlyViewed);
  const items = recentlyViewed ? recentlyViewed.items : [];
  const loading = recentlyViewed ? recentlyViewed.loading : false;

  useEffect(() => {
    dispatch(fetchRecentlyViewed());
  }, [dispatch]);

  console.log('[RecentlyViewed] items:', items, 'loading:', loading);

  if (loading || !items || items.length === 0) return null;

  return (
    <div className="recently-viewed-area pt-60 pb-60">
      <div className="container">
        <div className="section-title text-center mb-40">
          <h2>Recently Viewed</h2>
        </div>
        <div className="row">
          {items.map(product => (
            <div key={product.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 mb-25">
              <Link to={`/product/${product.id}`}>
                <div className="product-wrap">
                  {product.image && (
                    <div className="product-img">
                      <img src={product.image} alt={product.name} className="img-fluid" />
                    </div>
                  )}
                  <div className="product-content text-center mt-10">
                    <h5>{product.name}</h5>
                    {product.price && <span>${product.price.toFixed(2)}</span>}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;

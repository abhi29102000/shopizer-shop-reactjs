import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecentlyViewed } from '../../redux/actions/recentlyViewedActions';
import ProductModal from './ProductModal';
import WebService from '../../util/webService';
import constant from '../../util/constant';

const RecentlyViewed = ({ defaultStore, currentLanguageCode }) => {
  const dispatch = useDispatch();
  const recentlyViewed = useSelector(state => state.recentlyViewed);
  const items = recentlyViewed ? recentlyViewed.items : [];

  const [modalShow, setModalShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchRecentlyViewed());
  }, [dispatch]);

  const onQuickView = async (productId) => {
    try {
      const action = constant.ACTION.PRODUCTS + productId + '?lang=' + (currentLanguageCode || 'en') + '&store=' + (defaultStore || 'DEFAULT');
      const product = await WebService.get(action);
      if (product) {
        setSelectedProduct(product);
        setModalShow(true);
      }
    } catch (e) {}
  };

  if (!items || items.length === 0) return null;

  return (
    <div className="recently-viewed-area pt-60 pb-60">
      <div className="container">
        <div className="section-title text-center mb-40">
          <h2>Recently Viewed</h2>
        </div>
        <div className="row">
          {items.map(product => (
            <div key={product.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-6 mb-25">
              <div className="product-wrap" style={{ cursor: 'pointer' }} onClick={() => onQuickView(product.id)}>
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
            </div>
          ))}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          show={modalShow}
          onHide={() => setModalShow(false)}
          product={selectedProduct}
          defaultStore={defaultStore || 'DEFAULT'}
          finalproductprice={selectedProduct.price}
          finaldiscountedprice={selectedProduct.price}
          addtocart={() => {}}
        />
      )}
    </div>
  );
};

import { connect } from 'react-redux';
const mapStateToProps = state => ({
  defaultStore: state.merchantData.defaultStore,
  currentLanguageCode: state.multilanguage.currentLanguageCode
});

export default connect(mapStateToProps)(RecentlyViewed);

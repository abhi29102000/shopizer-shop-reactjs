import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import MetaTags from "react-meta-tags";
import { BreadcrumbsItem } from "react-breadcrumbs-dynamic";
import { connect } from "react-redux";
import Layout from "../../layouts/Layout";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
// import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import WebService from '../../util/webService';
import constant from '../../util/constant';
import { setLoader } from "../../redux/actions/loaderActions";
import { multilanguage } from "redux-multilanguage";
import { useDispatch } from "react-redux";
import { recordView } from "../../redux/actions/recentlyViewedActions";
import RecentlyViewed from "../../components/product/RecentlyViewed";
const ProductDetails = ({ strings, location, match, productID, currentLanguageCode, setLoader, defaultStore }) => {
  const dispatch = useDispatch();
  const { pathname } = location;
  // use URL param id if Redux productid not set (e.g. direct navigation)
  const resolvedProductID = productID || match?.params?.id;
  const [productDetails, setProductDetails] = useState();
  const [productReview, setProductReview] = useState([]);

  useEffect(() => {
    getProductDetails();
    getReview();
    if (resolvedProductID) dispatch(recordView(resolvedProductID));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedProductID]);

  const getProductDetails = async () => {
    setLoader(true)
    let action = constant.ACTION.PRODUCTS + resolvedProductID + '?lang=' + currentLanguageCode + '&store=' + defaultStore;
    try {
      let response = await WebService.get(action);
      if (response) {
        console.log(response)
        setProductDetails(response)
        setLoader(false)
      }
    } catch (error) {
      setLoader(false)
    }
  }
  const getReview = async () => {
    let action = constant.ACTION.PRODUCTS + resolvedProductID + '/reviews?store=' + defaultStore;
    try {
      let response = await WebService.get(action);
      if (response) {
        setProductReview(response)
      }
    } catch (error) {
    }
  }
  return (
    <Fragment>
      <MetaTags>
        <title>{productDetails && productDetails.description.title}</title>
        <meta
          name="description"
          content={productDetails && productDetails.description.metaDescription}
        />
      </MetaTags>

      <BreadcrumbsItem to={process.env.PUBLIC_URL + "/"}>{strings["Home"]}</BreadcrumbsItem>
      <BreadcrumbsItem to={process.env.PUBLIC_URL + pathname}>
        {productDetails && productDetails.description.name}
      </BreadcrumbsItem>

      <Layout headerContainerClass="container-fluid"
        headerPaddingClass="header-padding-2"
        headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb />

        {/* product description with image */}
        {
          productDetails &&
          <ProductImageDescription
            spaceTopClass="pt-100"
            spaceBottomClass="pb-100"
            strings={strings}
            product={productDetails}
          />
        }


        {/* product description tab */}
        {
          productDetails &&
          <ProductDescriptionTab
            spaceBottomClass="pb-90"
            strings={strings}
            product={productDetails}
            review={productReview}
          />
        }

        {/* recently viewed */}
        <RecentlyViewed />

        {/* related product slider */}
        {/* <RelatedProductSlider
          spaceBottomClass="pb-95"
          category={product.category[0]}
        /> */}
      </Layout>
    </Fragment>
  );
};

ProductDetails.propTypes = {
  location: PropTypes.object,
  productID: PropTypes.number,
  currentLanguageCode: PropTypes.string,
};

const mapStateToProps = (state, ownProps) => {
  // const itemId = ownProps.match.params.id;
  return {
    productID: state.productData.productid,
    currentLanguageCode: state.multilanguage.currentLanguageCode,
    defaultStore: state.merchantData.defaultStore
  };
};
const mapDispatchToProps = dispatch => {
  return {
    setLoader: (value) => {
      dispatch(setLoader(value));
    }
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(multilanguage(ProductDetails));

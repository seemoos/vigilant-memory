import {
    isNil as _isNil,
    get as _get,
    map as _map
} from 'lodash';
import Toast from 'react-native-root-toast';
import I18n from 'react-native-i18n'

import { APIURLs, AppAxios } from './../../Config/APIConfig';

import {
    GET_SHOP_CATEGORY_PRODUCTS_STARTED,
    GET_SHOP_CATEGORY_PRODUCTS_SUCCESS,
    GET_SHOP_CATEGORY_PRODUCTS_FAILED,
    GET_ADDITIONAL_SHOP_CATEGORY_PRODUCTS_REQUEST_STARTED,
    NO_MORE_SHOP_CATEGORY_PRODUCTS_TO_FETCH,
    CLEAN_CATEGORY_PRODUCTS_DATA
} from './ActionTypes';

/**
 * @param  {string} shopId
 * @param  {string} category
 * @param  {array} products
 * @param  {number} currentLimit
 * @param  {number} currentOffset
 * @param  {number} productsCount
 * @param  {boolean} shouldCleanData
 * @param  {boolean} shouldFetchCategories
 */
export const getCategoryProducts = (
    shopId,
    category,
    products,
    currentLimit,
    currentOffset,
    productsCount,
    shouldCleanData,
    shouldFetchCategories
) => {
    return async (dispatch) => {
        if (shouldCleanData) {
            dispatch(cleanCategoryProductsData());
        }

        // dispatch an action indicating that the getting products started
        dispatch(getCategoryProductsStarted(shouldCleanData ? null : products));

        try {
            const currentProductsCount = _get(products, 'length', 0);

            if (productsCount !== -1 && currentProductsCount >= productsCount && !shouldCleanData) {
                // no more products available
                dispatch(noMoreCategoryProductsToFetch());
            } else {
                const params = {
                    'criteria[shop]': shopId
                };
    
                if (!_isNil(category)) {
                    params['criteria[category]'] = category;
                }
    
                if (currentLimit !== -1 && !_isNil(currentLimit)) {
                    params.limit = currentLimit;
                }
    
                if (currentOffset !== -1 && !_isNil(currentOffset) && !shouldCleanData) {
                    params.offset = currentOffset + (params.limit || 0);
                }
    
                // get the next products
                const response = await AppAxios.get(APIURLs.getProductsOfShopBasedOnFilter, {
                    params
                });

                let categories;

                if (shouldFetchCategories) {
                    const categoriesResponse = await AppAxios.get(APIURLs.getProductsOfShopGroupedByCategory, {
                        params: {
                            shop: shopId
                        }
                    });
    
                    const { shopProducts: categoriesProducts } = categoriesResponse.data;
    
                    categories = _map(categoriesProducts, categoryProducts => ({
                        label: categoryProducts.category,
                        value: categoryProducts.category
                    }));
    
                    categories.splice(0, 0, { label: I18n.t('products_screen_all_text'), value: 'all' });
                }

    
                const { shopProducts, count, offset, limit } = response.data;
    
                let allProducts = shopProducts;
        
                if (!_isNil(products) && !shouldCleanData) {
                    allProducts = [...products, ...shopProducts];
                }
    
                // dispatch an action with the products
                dispatch(getCategoryProductsSuccess(allProducts, categories, count, offset, limit));
            }
        } catch (error) {
            const message = _get(error.response, 'data.message', 'Something went wrong');
            Toast.show(message, {
                position: Toast.positions.BOTTOM,
                duration: Toast.durations.SHORT,
                shadow: true,
                animation: true,
                hideOnPress: true,
            });
            dispatch(getCategoryProductsFailed(error));
        }
    };
};

export const cleanCategoryProductsData = () => {
    return { type: CLEAN_CATEGORY_PRODUCTS_DATA };
};

function getCategoryProductsStarted(products) {
    if (!_isNil(products)) {
        return { type: GET_ADDITIONAL_SHOP_CATEGORY_PRODUCTS_REQUEST_STARTED };
    }

    return { type: GET_SHOP_CATEGORY_PRODUCTS_STARTED };
}

function noMoreCategoryProductsToFetch() {
    return { type: NO_MORE_SHOP_CATEGORY_PRODUCTS_TO_FETCH };
}

function getCategoryProductsSuccess(products, categories, count, offset, limit) {
    return { type: GET_SHOP_CATEGORY_PRODUCTS_SUCCESS, products, categories, count, offset, limit };
}

function getCategoryProductsFailed(error) {
    return { type: GET_SHOP_CATEGORY_PRODUCTS_FAILED, error };
}


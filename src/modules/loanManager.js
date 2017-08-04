/*
    TODO: split action creator and reducer
    TODO: handle race conditions
    TODO: split REFRESH and REFRESH PRODUCTS (and add event listener to refresh when one changed or added...)
    TODO: use selectors. eg: https://github.com/reactjs/reselect
*/

import store from './../store'
import SolidityContract from './SolidityContract';
import loanManager_artifacts from '../contractsBuild/LoanManager.json' ;
import moment from 'moment';
import {asyncGetBalance , getUcdBalance, repayLoanTx, newEthBackedLoanTx} from './ethHelper'

export const LOANMANAGER_CONNECT_REQUESTED = 'loanManager/LOANMANAGER_CONNECT_REQUESTED'
export const LOANMANAGER_CONNECTED= 'loanManager/LOANMANAGER_CONNECTED'

export const LOANMANAGER_REFRESH_REQUESTED = 'loanManager/LOANMANAGER_REFRESH_REQUESTED'
export const LOANMANAGER_REFRESHED= 'loanManager/LOANMANAGER_REFRESHED'

export const LOANMANAGER_NEWLOAN_REQUESTED = 'loanManager/LOANMANAGER_NEWLOAN_REQUESTED'
export const LOANMANAGER_NEWLOAN_CREATED = 'loanManager/LOANMANAGER_NEWLOAN_CREATED'
export const LOANMANAGER_NEWLOAN_ERROR = 'loanManager/LOANMANAGER_NEWLOAN_ERROR'

export const LOANMANAGER_REPAY_REQUESTED = 'loanManager/LOANMANAGER_REPAY_REQUESTED'
export const LOANMANAGER_REPAY_SUCCESS = 'loanManager/LOANMANAGER_REPAY_SUCCESS'
export const LOANMANAGER_REPAY_ERROR = 'loanManager/LOANMANAGER_REPAY_ERROR'

const initialState = {
    contract: null,
    ucdBalance: '?',
    ethBalance: '?',
    owner: '?',
    ratesAddress: '?',
    tokenUcdAddress: '?',
    loanCount: '?',
    productCount: '?',
    products: null,
    error: null,
    result: null
}

export default (state = initialState, action) => {
    switch (action.type) {
        case LOANMANAGER_CONNECT_REQUESTED:
        return {
            ...state
        }

        case LOANMANAGER_CONNECTED:
        return {
            ...state,
            contract: action.contract
        }

        case LOANMANAGER_REFRESH_REQUESTED:
        return {
            ...state
        }

        case LOANMANAGER_REFRESHED:
        return {
            ...state,
            owner: action.owner,
            ethBalance: action.ethBalance,
            ucdBalance: action.ucdBalance,
            loanCount: action.loanCount,
            productCount: action.productCount,
            products: action.products,
            ratesAddress: action.ratesAddress,
            tokenUcdAddress: action.tokenUcdAddress
        }

        case LOANMANAGER_NEWLOAN_REQUESTED:
        return {
            ...state,
            error: null,
            result: null,
            ethAmount: action.ethAmount,
            productId: action.productId
        }

        case LOANMANAGER_NEWLOAN_ERROR:
        return {
            ...state,
            error: action.error
        }

        case LOANMANAGER_NEWLOAN_CREATED:
        return {
            ...state,
            result: action.result
        }

        case LOANMANAGER_REPAY_REQUESTED:
        return {
            ...state,
            loanId: action.loandId,
            error: null,
            result: null
        }

        case LOANMANAGER_REPAY_SUCCESS:
        return {
            ...state,
            result: action.result
        }

        case LOANMANAGER_REPAY_ERROR:
        return {
            ...state,
            error: action.error
        }

        default:
            return state
    }
}

export const connectloanManager =  () => {
    return async dispatch => {
        dispatch({
            type: LOANMANAGER_CONNECT_REQUESTED
        })
        return dispatch({
            type: LOANMANAGER_CONNECTED,
            contract: await SolidityContract.connectNew(
                store.getState().ethBase.web3Instance.currentProvider, loanManager_artifacts)
        })
    }
}

export const refreshLoanManager =  () => {
    return async dispatch => {
        dispatch({
            type: LOANMANAGER_REFRESH_REQUESTED
        })
        let loanManager = store.getState().loanManager.contract.instance;
        // TODO: make calls paralel
        let decimalsDiv = 10 ** (await store.getState().tokenUcd.contract.instance.decimals()).toNumber(); // TODO: get this from store.tokenUcd (timing issues on first load..)
        let loanCount = await loanManager.getLoanCount();
        let productCount = await loanManager.getProductCount();
        let products = [];
        for (let i=0; i < productCount; i++) {
            let p = await loanManager.products(i);
            let term = p[0].toNumber();
            // TODO: less precision for duration: https://github.com/jsmreese/moment-duration-format
            let repayPeriod = p[4].toNumber();
            let prod = {
                id: i,
                term: term,
                termText: moment.duration(term, "seconds").humanize(),
                discountRate: p[1].toNumber() / 1000000,
                loanCoverageRatio: p[2].toNumber() / 1000000,
                minDisbursedAmountInUcd: p[3].toNumber() / decimalsDiv,
                repayPeriod: repayPeriod,
                repayPeriodText: moment.duration(repayPeriod, "seconds").humanize(),
                isActive: p[5]
            }
            products.push(prod);
        }
        let tokenUcdAddress = await loanManager.tokenUcd();
        let ratesAddress = await loanManager.rates();
        let owner = await loanManager.owner();

        let ethBalance = await asyncGetBalance(loanManager.address);
        let ucdBalance = await getUcdBalance(loanManager.address);
        return dispatch({
                type: LOANMANAGER_REFRESHED,
                owner: owner,
                ethBalance: ethBalance,
                ucdBalance: ucdBalance,
                loanCount: loanCount.toNumber(),
                products: products,
                productCount: productCount.toNumber(),
                tokenUcdAddress: tokenUcdAddress,
                ratesAddress: ratesAddress
        });
    }
}

export function newLoan(productId, ethAmount) {
    return async dispatch =>  {
        // TODO: shall we emmit error if already submitting or enough as it is (submit disabled on form)
        dispatch({
            type: LOANMANAGER_NEWLOAN_REQUESTED,
            ethAmount: ethAmount,
            productId: productId
        })

        try {
            let result = await newEthBackedLoanTx(productId, ethAmount);
            return dispatch({
                type: LOANMANAGER_NEWLOAN_CREATED,
                result: result
            });
        } catch( error)  {
            return dispatch({
                type: LOANMANAGER_NEWLOAN_ERROR,
                error: error
            });
        }
    }
}

export function repayLoan(loanId) {
    return async dispatch =>  {
        dispatch({
            type: LOANMANAGER_REPAY_REQUESTED,
            loanId: loanId
        })

        // FIXME: per user loanId vs.  global loan id - need to be fixed in contracts
        try {
            let result = await repayLoanTx(loanId);
            return dispatch({
                type: LOANMANAGER_REPAY_SUCCESS,
                result: result
            });
        } catch (error) {
            return dispatch({
                type: LOANMANAGER_REPAY_ERROR,
                error: error
            })
        }
    }
}

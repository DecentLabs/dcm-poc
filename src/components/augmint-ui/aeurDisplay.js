import React from "react";
import styled from "styled-components";
import { DECIMALS } from "utils/constants";

const StyledSpan = styled.span`
    white-space: nowrap;
`;

/*
    amount: amount to display (an integer in the smallest unit of account)
    raw: set to true, if amount is a floating point num (the number will be printed without unit conversion)
 */
export class AEUR extends React.Component {
    render() {
        const { amount, raw, className } = this.props;
        let txAmount = amount;
        if (!raw) {
            txAmount = txAmount / Math.pow(10, DECIMALS);
        }
        const _className = txAmount === 0 ? "zero" : txAmount > 0 ? "positive" : "negative";
        if (txAmount.toFixed) {
            return <StyledSpan className={className + " " + _className}>{txAmount.toFixed(DECIMALS)} A€</StyledSpan>;
        } else {
            console.log(txAmount);
            return txAmount;
        }
    }
}

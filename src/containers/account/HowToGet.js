import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { default as theme, remCalc } from "styles/theme";
import { media } from "styles/media";
import { Psegment, Pgrid, Pblock } from "components/PageLayout";
import { EthereumState } from "containers/app/EthereumState";
import Button from "components/augmint-ui/button";
import Message from "components/augmint-ui/message";
import { MrCoinBuyLink } from "components/ExchangeLinks";
import { BaseButton } from "components/augmint-ui/button/styles";

const StyledHeader = styled.h1`
    margin-top: 10px;
    font-family: ${theme.typography.fontFamilies.title};
    font-size: ${remCalc(32)};
    font-weight: 100;

    ${media.tablet`
        font-size: ${remCalc(28)};
    `};
`;

const StyledSubHeader = styled.h3`
    font-family: ${theme.typography.fontFamilies.default};
    font-size: ${remCalc(24)};
    font-weight: bold;

    small {
        font-size: ${remCalc(18)};
        font-weight: normal;
    }
`;

const TextBlock = function(props) {
    const { header, action, children, ...other } = props;
    return (
        <div {...other}>
            <StyledSubHeader>{header}</StyledSubHeader>
            {children}
            <div style={{ textAlign: "right" }}>{action}</div>
        </div>
    );
};

const StyledTextBlock = styled(TextBlock)`
    margin-top: 30px;
    padding-top: 10px;
    border-top: 1px solid ${theme.colors.grey};
    font-size: ${remCalc(14)};
`;

const MrCoinBuyButton = BaseButton(styled(MrCoinBuyLink));

class HowToGet extends React.Component {
    render() {
        const web3Connect = this.props.web3Connect;

        return (
            <EthereumState>
                <Psegment>
                    <Pgrid>
                        <Pgrid.Row>
                            <Pgrid.Column size={{ mobile: 1, tablet: 2 / 3 }}>
                                <Pblock>
                                    <StyledHeader>How to get A-EUR?</StyledHeader>
                                    <StyledTextBlock style={{ marginTop: "0", paddingTop: "0", borderTop: "0" }}>
                                        <p>
                                            <em>
                                                You need ETH to send transactions to the Ethereum network (e.g. send
                                                A-EUR or buy for ETH).
                                            </em>
                                        </p>
                                        <p>
                                            <em>
                                                To get real ETH on mainnet see{" "}
                                                <a
                                                    href="https://cointelegraph.com/ethereum-for-beginners/how-to-buy-ethereum"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    this guide
                                                </a>
                                                .
                                            </em>
                                        </p>
                                    </StyledTextBlock>
                                    <StyledTextBlock
                                        header={
                                            <span>
                                                Buy for ETH <small>on Augmint’s exchange</small>
                                            </span>
                                        }
                                        action={<Button to="/exchange">Buy A-EUR for ETH</Button>}
                                    >
                                        <p>Buy/sell A-EUR for ETH on Augmint's decentralised exchange.</p>
                                    </StyledTextBlock>
                                    <StyledTextBlock
                                        header={
                                            <span>
                                                Buy for fiat <small>on partner exchange</small>
                                            </span>
                                        }
                                        action={
                                            <MrCoinBuyButton className="dashboardColors" web3Connect={web3Connect}>
                                                Buy A-EUR for fiat
                                            </MrCoinBuyButton>
                                        }
                                    >
                                        <p>Buy/sell A-EUR for EUR (or ETH) on our partner exchanges.</p>
                                    </StyledTextBlock>
                                    <StyledTextBlock
                                        header={
                                            <span>
                                                Get a loan <small>for ETH collateral</small>
                                            </span>
                                        }
                                        action={<Button to="/loan/new">Get a new loan</Button>}
                                    >
                                        <p>
                                            Start spending the value of your ETH while keeping your investment.
                                            <br />
                                            You can get A-EUR for placing your ETH in escrow (collateral). You will get
                                            back all of your ETH when you repay your A-EUR loan anytime before it's due
                                            (maturity).
                                        </p>
                                    </StyledTextBlock>
                                </Pblock>
                            </Pgrid.Column>
                            <Pgrid.Column size={{ tablet: 1 / 3 }} className="hidden-xs">
                                <Message info style={{ margin: 0 }}>
                                    <h4>
                                        <strong>What is it?</strong>
                                    </h4>
                                    <p>
                                        Augmint offers digital tokens targeted to a fiat currency.
                                        <br />
                                        The first Augmint token is A-Euro, targeted to Euro. The value of 1 A-EUR is
                                        always around 1 EUR.
                                    </p>
                                    <p style={{ marginTop: 15, textAlign: "right" }}>
                                        <Button to="/">More info</Button>
                                    </p>
                                </Message>
                            </Pgrid.Column>
                        </Pgrid.Row>
                    </Pgrid>
                </Psegment>
            </EthereumState>
        );
    }
}

const mapStateToProps = state => ({
    web3Connect: state.web3Connect
});

export default connect(mapStateToProps)(HowToGet);

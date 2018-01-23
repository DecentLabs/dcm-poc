import React from "react";
import { Pblock } from "components/PageLayout";
import { MyListGroup, MyGridTable, MyGridTableRow as Row, MyGridTableColumn as Col } from "components/MyListGroups";
import { ErrorPanel } from "components/MsgPanels";

export default class TransferList extends React.Component {
    render() {
        const { filter, header, noItemMessage, userAccountAddress } = this.props;
        const { transfers, isLoading, error } = this.props.transfers;
        const listItems =
            transfers !== null &&
            transfers.filter(filter).map((tx, index) => (
                <MyListGroup.Row
                    key={`txRowDiv-${tx.blockNumber}-${tx.transactionIndex}-${tx.logIndex}-${tx.direction}`}
                >
                    <MyGridTable
                        divided={false}
                        key={`txTableDiv-${tx.blockNumber}-${tx.transactionIndex}-${tx.logIndex}-${tx.direction}`}
                    >
                        <Row columns={1}>
                            <Col>
                                {tx.from.toLowerCase() === userAccountAddress.toLowerCase()
                                    ? "To: " + tx.to
                                    : "From: " + tx.from}
                            </Col>
                        </Row>
                        <Row columns={3}>
                            <Col>Amount: {tx.amount} ACE</Col>
                            <Col>Fee: {tx.fee} ACE</Col>
                            <Col>on {tx.blockTimeStampText}</Col>
                        </Row>

                        {tx.narrative && (
                            <Row columns={1}>
                                <Col>{tx.narrative}</Col>
                            </Row>
                        )}
                        <Row columns={1}>
                            <Col>
                                <small>
                                    blockNumber: {tx.blockNumber} | transactionIndex: {tx.transactionIndex} | type:{" "}
                                    {tx.type}
                                </small>
                            </Col>
                        </Row>
                    </MyGridTable>
                </MyListGroup.Row>
            ));

        return (
            <Pblock loading={isLoading} header={header}>
                {error && <ErrorPanel header="Error while fetching transfer list">{error.message}</ErrorPanel>}
                {transfers == null && !isLoading && <p>Connecting...</p>}
                {isLoading && <p>Refreshing transaction list...</p>}
                {transfers != null && (
                    <MyListGroup id="transferListDiv">{listItems.length === 0 ? noItemMessage : listItems}</MyListGroup>
                )}
            </Pblock>
        );
    }
}

TransferList.defaultProps = {
    transfers: null,
    userAccountAddress: null,
    filter: () => {
        return true; // no filter passed
    },
    noItemMessage: <p>No transactions</p>,
    header: "ACE transfer history"
};

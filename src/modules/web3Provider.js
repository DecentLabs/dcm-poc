import store from "modules/store";
import { setupWeb3, accountChange } from "modules/reducers/web3Connect";
import { connectContracts } from "modules/reducers/contracts";

/*
    TODO: make it to a HOC
*/
let newBlockHeadersFilter, pendingTransactionsFilter;
let intervalId;

export const connectWeb3 = () => {
    console.log("connect web3");

    const web3Connect = store.getState().web3Connect;
    const disclaimerAccepted = web3Connect.disclaimerAccepted;
    const documentProps = store.getState().documentProps;
    const documentLoaded = documentProps.documentLoaded;

    const mainPath = window.location.pathname.split("/").length > 0 ? "/" + window.location.pathname.split("/")[1] : "";
    const shouldConnect = ["/", "/concept", "/manifesto", "/disclaimer", "/roadmap", "/team"].indexOf(mainPath) < 0;

    if (shouldConnect && disclaimerAccepted && documentLoaded) {
        if (!web3Connect.isConnected && !web3Connect.isLoading) {
            // if web3 is not connected
            onLoad();
        } else if (web3Connect.isConnected && !web3Connect.isLoading && !web3Connect.userConnected) {
            // if web3 is connected, but user rejected to connect address to augmint
            onLoad();
        }
    }

    // Deprecated
    // let web3Connect = store.getState().web3Connect;
    //
    // if (!web3Connect.isConnected && !web3Connect.isLoading) {
    //     console.debug(
    //         "web3Provider - web3 is not connected and not loading. Setting up watches and dispatching setUpWeb3() for onLoad"
    //     );
    //     setupWatch("web3Connect.network", onWeb3NetworkChange);
    //     if (document.readyState === "complete" && disclaimerAccepted) {
    //         onLoad();
    //     } else {
    //         window.addEventListener("load", onLoad);
    //     }
    // }
    // return;
};

const onLoad = () => {
    console.log("LOAD");
    store.dispatch(setupWeb3());
    if (!intervalId) {
        intervalId = setInterval(async function() {
            const web3 = store.getState().web3Connect;
            if (web3 && web3.isConnected && !web3.isLoading) {
                const currentAccounts = await web3.web3Instance.eth.getAccounts();
                const userAccount = store.getState().web3Connect.userAccount;
                if (currentAccounts[0] !== userAccount) {
                    console.debug(
                        "App.setInterval - web3.eth.accounts[0] change detected. dispatching accountChange()"
                    );
                    store.dispatch(accountChange(currentAccounts));
                }
            }
        }, 1000);
    }
};

export const onWeb3NetworkChange = (newVal, oldVal, objectPath) => {
    console.log("WEB3 NETWORK CHANGE");
    // TODO: make filters + subscriptions generic, e.g use an array
    if (newBlockHeadersFilter) {
        newBlockHeadersFilter.unsubscribe();
    }
    if (pendingTransactionsFilter) {
        pendingTransactionsFilter.unsubscribe();
    }

    if (newVal) {
        store.dispatch(connectContracts());
        console.debug("web3Provider - web3Connect.network changed. subscribing to newBlockHeaders event (not working)");
        // const web3 = store.getState().web3Connect.web3Instance;
        // FIXME: these are not working b/c: https://github.com/MetaMask/metamask-extension/issues/2393
        // newBlockHeadersFilter = web3.eth.subscribe("newBlockHeaders", onNewBlock);
        // pendingTransactionsFilter = web3.eth
        //     .subscribe("pendingTransactions", (error, tx) => {
        //         if (error) {
        //             console.error("pendingTransaction error:", error);
        //         } else {
        //             console.debug("pendingTransactions", tx);
        //         }
        //     })
        //     .on("data", tx => onPendingTransaction(tx));
    }
};

// const onNewBlock = (error, result) => {
//     console.debug("web3Provider.onNewBlock");
// };
//
// const onPendingTransaction = tx => {
//     console.debug("onPendingTransaction", tx);
// };

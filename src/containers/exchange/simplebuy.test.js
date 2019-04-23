import { matchOrders } from "./simplebuy";

const rate = 142;

const buyerOrders = [
    {
        ethers: 0.012,
        price: 0.91
    },
    {
        ethers: 0.017,
        price: 0.9
    },
    {
        ethers: 0.027,
        price: 0.85
    }
].map(i => {
    i.amount = i.ethers * rate * i.price;
    return i;
});

const sellerOrders = [
    {
        amount: 1.2,
        price: 1
    },
    {
        amount: 1,
        price: 0.99
    },
    {
        amount: 1.8,
        price: 0.96
    }
].map(i => {
    i.ethers = (i.amount * i.price) / rate;
    return i;
});

describe("matching orders", () => {
    it("match toBuy AEUR", () => {
        const result = {
            tokens: 3,
            ethers: 0.02759,
            limitPrice: 1,
            averagePrice: 0.986
        };

        const expected = matchOrders(3, sellerOrders, 0);

        expect(expected.tokens).toEqual(result.tokens);
        expect(expected.ethers).toEqual(result.ethers);
        expect(expected.limitPrice).toEqual(result.limitPrice);
        expect(expected.averagePrice).toEqual(result.averagePrice);
    });

    it("match toSell AEUR", () => {
        const result = {
            tokens: 4,
            ethers: 0.044,
            limitPrice: 0.85,
            averagePrice: 0.859
        };

        const expected = matchOrders(4, buyerOrders, 1);

        expect(expected.tokens).toEqual(result.tokens);
        expect(expected.ethers).toEqual(result.ethers);
        expect(expected.limitPrice).toEqual(result.limitPrice);
        expect(expected.averagePrice).toEqual(result.averagePrice);
    });
});

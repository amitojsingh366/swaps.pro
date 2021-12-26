/*
    Swaps.pro End 2 End Swaps

    These e2e tests are extensions to the core pioneer-sdk

    Ref Test: pioneer-sdk
        *TODO

 */
const axios = require('axios').default;

describe('Pair a MetaMask wallet', () => {
    it('Should init app successfully', () => {
        let result = cy.visit('http://localhost:3006/')
        //init
        cy.get('.css-1qlxn50 > .chakra-stack > .chakra-button').should('have.text', 'Connect Wallet');
    })

    it('Bridge server should be online', () => {
        //TODO
    })

})

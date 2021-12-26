/*
    Swaps.pro End 2 End Swaps

    These e2e tests are extensions to the core pioneer-sdk

    Ref Test: pioneer-sdk
        https://github.com/BitHighlander/pioneer/tree/develop/e2e/sdk-thorchain-swaps/ethereum-e2e-swap-metamask

 */

describe('Pair a MetaMask wallet', () => {
    it('Should init app successfully', () => {
        //result
        let result = cy.visit('http://localhost:3006/')
        //init
        cy.get('.css-1qlxn50 > .chakra-stack > .chakra-button').should('have.text', 'Connect Wallet');
    })

    it('Select Onboard.js connect wallet', () => {
        cy.get('.css-1qlxn50 > .chakra-stack > .chakra-button').click()
        cy.get(':nth-child(2) > .chakra-button').click();
    })

    it('Onboard.js Modal should display info', () => {
        //accept terms
        cy.get('.bn-onboard-modal-terms-of-service > .bn-onboard-custom').click()


        //select metamask
        cy.get('.svelte-q1527 > .bn-onboard-custom').click()
    })



})

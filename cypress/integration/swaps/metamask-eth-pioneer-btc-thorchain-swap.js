describe('First Web Test', () => {
    it('This is a Test and it does not do much!', () => {

        let result = cy.visit('http://localhost:3000/')
        console.log("cy: ",cy)
        cy.contains('type').click()
        cy.get('.css-1qlxn50 > .chakra-stack > .chakra-button').should('have.text', 'Connect Wallet');
    })

    it('Page Should Containt The Following Strings', () => {
        cy.get('.css-1qlxn50 > .chakra-stack > .chakra-button').click();

        cy.get('#chakra-modal--body-2 > .chakra-stack > :nth-child(4)').should('have.text', 'Onboard.jsSupports: MetaMask');
        cy.get('#chakra-modal--body-2 > .chakra-stack > :nth-child(4)').click()
        cy.get('.bn-onboard-modal-terms-of-service > span').click()
        cy.get('div.svelte-q1527 > .bn-onboard-custom').click()
        cy.get(':nth-child(10) > .bn-onboard-custom').click()
        cy.get('#chakra-modal--body-2 > .chakra-stack > :nth-child(2)').click()
    })

})

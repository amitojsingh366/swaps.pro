describe('Pair Pioneer', () => {
    it('Open the wallets tab', () => {

        let result = cy.visit('http://localhost:3000/')
        console.log("cy: ",cy)
        cy.contains('type').click()
        cy.get('.css-1qlxn50 > .chakra-stack > .chakra-button').should('have.text', 'Connect Wallet');
    })

    it('click pioneer', () => {
        cy.get('.css-1qlxn50 > .chakra-stack > .chakra-button').click();

        // cy.get('#chakra-modal--body-2 > .chakra-stack > :nth-child(2)').should('have.text', 'Pioneer');
        // cy.get('#chakra-modal--body-2 > .chakra-stack > :nth-child(2)').click()

        // cy.get('#chakra-modal--header-2').should('have.text', 'Pair Pioneer');
        // cy.get('h3 > .chakra-button').should('have.text', 'Copy');
        // cy.get('h3 > .chakra-button').click()

        //get clipboard
        // cy.task('getClipboard').then(($clip) => {
        //     const url = $clip;
        //     cy.log('this is what was in clipboard', url);
        //     cy.visit(url);
        // });

        //local storage example
        //expect(localStorage.getItem("KeyToOurValue")).to.exist()

    })

})

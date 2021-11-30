/*
    Swaps.pro End 2 End testing

    These e2e tests are extensions to the core pioneer-sdk

    Ref Test: pioneer-sdk
        https://github.com/BitHighlander/pioneer/tree/develop/e2e/sdk-support/pair-metamask


    TODO add websocket https://adityanaik.dev/blog/2020/05/12/how-to-test-your-react-websocket-implementation-using-cypress/

 */
import {sleep} from 'wait-promise';


describe('Pair a KeepKey wallet', () => {
    it('Should init app successfully', () => {
        let result = cy.visit('http://localhost:3000/')
        //init
        cy.get('.css-1qlxn50 > .chakra-stack > .chakra-button').should('have.text', 'Connect Wallet');
    })

    it('Select KeepKey connect wallet', () => {
        cy.get('.css-1qlxn50 > .chakra-stack > .chakra-button').click()

        //Above DOES not work!
        //NOTE: the rules of webUsb is the user must click himselc
        //So for this test we just manually do this step (click on connect KeepKey Button)

    })

    it('KeepKey should connect and unlock', async () => {
        //While not unlocked

        // let ready = false
        // while(!ready){
        //     //read status
        //     let valueStatusWindow = cy.get('.chakra-stack > div')
        //     console.log("valueStatusWindow: ",valueStatusWindow)
        //     //parse status
        //
        //     console.log("Not ready!")
        //     await sleep(6000)
        // }


    })

    //TODO pair and sync balances
})

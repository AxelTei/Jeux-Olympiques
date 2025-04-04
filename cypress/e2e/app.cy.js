describe('Visit', () => {
    it('Should visit the home page', () => {
        // Visit the index page
        cy.visit('http://localhost:3000/')
    })
})
describe('Visit', () => {
    it('Should visit the home page', () => {
        // Visit the index page
        cy.visit('http://localhost:3000/')
    })
})

describe('Visit', () => {
    it('Should visit the booking page', () => {
        // Visit the index page
        cy.visit('http://localhost:3000/NosOffres')
    })
})

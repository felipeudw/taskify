describe('Login Test', () => {
    it('should login with seeded user', () => {
        cy.visit('/login');
        cy.get('input[name="email"]').type('testuser@taskify.app');
        cy.get('input[name="password"]').type('testPaskiPass@12');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/boards');
    });
});
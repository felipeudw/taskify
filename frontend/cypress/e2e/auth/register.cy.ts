describe('User Registration', () => {
    it('should register a new user', () => {
        cy.visit('/register');
        cy.get('input[name="email"]').type(`test${Date.now()}@mail.com`);
        cy.get('input[name="password"]').type('taskPassword123!');
        cy.get('button[type="submit"]').click();
        cy.url().should('include', '/boards'); // redirect after register
    });
});
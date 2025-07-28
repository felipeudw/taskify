describe('Task Creation', () => {
    beforeEach(() => {
        cy.loginUI();
    });

    it('should create a new task successfully', () => {
        // Open modal
        cy.get('[data-testid="add-task-button"]').click();

        // Fill title
        cy.get('[data-testid="task-title-input"]').type('My New Cypress Task');

        // Select priority
        //cy.get('[data-testid="priority-select"]').click();
        cy.contains('Normal Priority');

        // Select column
        //cy.get('[data-testid="column-select"]').click();
        cy.contains('Inbox');

        // Submit form
        cy.get('[data-testid="submit-task"]').click();

        // Assert task appears in correct column
        cy.contains('Inbox').parent().within(() => {
            cy.contains('My New Cypress Task').should('exist');
        });
    });
});

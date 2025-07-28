declare namespace Cypress {
    interface Chainable {
        loginUI(email: string, password: string): Chainable<void>;
    }
}
export const getGreeting = (): Cypress.Chainable<JQuery<HTMLElement>> => cy.get('h1');

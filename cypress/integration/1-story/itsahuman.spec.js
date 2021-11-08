/// <reference types="cypress" />

// Welcome to Cypress!
//
// This spec file contains a variety of sample tests
// for a todo list app that are designed to demonstrate
// the power of writing tests in Cypress.
//
// To learn more about how Cypress works and
// what makes it such an awesome testing tool,
// please read our getting started guide:
// https://on.cypress.io/introduction-to-cypress

describe("StartPage", () => {
  beforeEach(() => {
    // Cypress starts out with a blank slate for each test
    // so we must tell it to visit our website with the `cy.visit()` command.
    // Since we want to visit the same URL at the start of all our tests,
    // we include it in our beforeEach function so that it runs before each test
    cy.visit("http://localhost:3000/");
    cy.get(".btn-skip").click({ force: true });
  });

  it("can click its a human", () => {
    // click the first node
    cy.get(".hidden-node-button", { timeout: 20 * 1000 })
      .first()
      .click({ force: true });
    // click it's a human
    cy.get(".its-a-human").click({ force: true });
  });
});

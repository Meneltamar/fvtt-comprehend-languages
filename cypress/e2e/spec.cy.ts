describe("Basic Translation flow", () => {
  it("Translates root level documents", () => {
    cy.visit("http://localhost:30000");

    expect(true).to.equal(true);
    /* ==== Generated with Cypress Studio ==== */
    cy.get("select").select("Mr8MWHjeLe3odkDd");
    cy.get(".join-form > .form-footer > .bright").click();
    cy.get('[data-tab="journal"] > .fas').click();
    /* ==== End Cypress Studio ==== */
    /* ==== Generated with Cypress Studio ==== */
    cy.contains("NPC").click();
    cy.get("[id^=comprehend-languages_]").click();
    cy.wait(500);
    cy.get(".close > .fas").click();
    cy.contains("DE_NPC").click();
    cy.contains("1. Dodger the Goblin").click();
    cy.get(".pre-wrap > :nth-child(2)").should(
      "contain.text",
      "Dodger ist ein Goblin-Händler,"
    );
    cy.wait(500);
    cy.get(".close > .fas").click();
    /* ==== End Cypress Studio ==== */
    cy.contains("DE_NPC").rightclick();
    cy.contains("Delete").click();
    cy.contains("Yes").click();
  });
});

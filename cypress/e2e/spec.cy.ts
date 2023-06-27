import * as foundry from "../../types/foundry/index";
import { ComprehendLanguagesStatic } from "../../src/scripts/statics";
import { capitalize } from "cypress/types/lodash";
declare const game: Game;
declare const Hooks: any;

const mockTranslation = {
  translations: [{ text: "Translated Text" }],
};

describe("Basic Translation flow", () => {
  beforeEach(() => {
    cy.intercept("GET", "https://api-free.deepl.com/v2/translate*", {
      statusCode: 200,
      body: mockTranslation,
    }).as("translation");
    cy.visit("http://localhost:30000");

    expect(true).to.equal(true);
    /* ==== Generated with Cypress Studio ==== */
    cy.get("select").select("Mr8MWHjeLe3odkDd");
    cy.get(".join-form > .form-footer > .bright").click();
    cy.wait(1000);
    cy.get('[data-tab="journal"] > .fas').click();
  });
  it("Translates root level documents", () => {
    cy.wait(1500);
    cy.window().then((win) => {
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.SEPARATE_FOLDER,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_JOURNAL_NAME,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_FOLDER_NAME,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.IN_PLACE,
        false
      );
    });
    cy.get(".error > .close").click();
    cy.get(".warning > .close").click();
    cy.contains("NPC").click();
    cy.get("[id^=comprehend-languages_]").click();
    cy.wait(1000);
    cy.get(".close > .fas").click();
    cy.contains("DE_NPC").click();
    cy.contains("1. Dodger the Goblin").click();
    cy.get(".journal-page-content").should("contain.text", "Translated Text");
    cy.wait(1000);
    cy.get(".close > .fas").click();
    /* ==== End Cypress Studio ==== */
    cy.contains("DE_NPC").rightclick();
    cy.contains("Delete").click();
    cy.contains("Yes").click();
  });

  it("Translates documents in folders with the separate-folder setting false", () => {
    cy.wait(1500);
    cy.contains("TestFolder").click();
    cy.window().then((win) => {
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.SEPARATE_FOLDER,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_JOURNAL_NAME,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_FOLDER_NAME,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.IN_PLACE,
        false
      );
    });
    cy.get(".error > .close").click();
    cy.get(".warning > .close").click();
    cy.contains("DocumentInFolder").click();
    cy.get("[id^=comprehend-languages_]").click();
    cy.wait(1000);
    cy.get(".close > .fas").click();
    cy.contains("DE_DocumentInFolder").click();
    cy.get(".journal-page-content").should("contain.text", "Translated Text");
    cy.wait(1000);
    cy.get(".close > .fas").click();
    cy.contains("DE_DocumentInFolder").rightclick();
    cy.contains("Delete").click();
    cy.contains("Yes").click();
  });

  it("Translates documents in folders with the separate-folder setting true", () => {
    cy.wait(1500);
    cy.contains("TestFolder").click();
    cy.window().then((win) => {
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.SEPARATE_FOLDER,
        true
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_JOURNAL_NAME,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_FOLDER_NAME,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.IN_PLACE,
        false
      );
    });
    cy.get(".error > .close").click();
    cy.get(".warning > .close").click();
    cy.contains("DocumentInFolder").click();
    cy.get("[id^=comprehend-languages_]").click();
    cy.wait(1000);
    cy.get(".close > .fas").click();
    cy.wait(1000);
    cy.contains(/\bTestFolder\b/).click();
    cy.contains("DE_TestFolder").click();
    cy.wait(1000);
    cy.contains("DE_DocumentInFolder").click();
    cy.get(".journal-page-content").should("contain.text", "Translated Text");
    cy.wait(1000);
    cy.get(".close > .fas").click();
    cy.contains("DE_TestFolder").rightclick();
    cy.contains("Delete All").click();
    cy.contains("Yes").click();
  });

  it("Translates documents in folders with the separate-folder setting false and translate-journal-name true", () => {
    cy.wait(1500);
    cy.contains("TestFolder").click();
    cy.window().then((win) => {
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.SEPARATE_FOLDER,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_JOURNAL_NAME,
        true
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_FOLDER_NAME,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.IN_PLACE,
        false
      );
    });
    cy.get(".error > .close").click();
    cy.get(".warning > .close").click();
    cy.contains("DocumentInFolder").click();
    cy.get("[id^=comprehend-languages_]").click();
    cy.wait(1000);
    cy.get(".close > .fas").click();
    cy.contains("Translated Text").click();
    cy.get(".journal-page-content").should("contain.text", "Translated Text");
    cy.wait(1000);
    cy.get(".close > .fas").click();
    cy.contains("Translated Text").rightclick();
    cy.contains("Delete").click();
    cy.contains("Yes").click();
  });

  it("Translates documents in folders with the separate-folder setting true and the translate-folder setting true", () => {
    cy.wait(1500);
    cy.contains("TestFolder").click();
    cy.window().then((win) => {
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.SEPARATE_FOLDER,
        true
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_JOURNAL_NAME,
        false
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_FOLDER_NAME,
        true
      );
      win.game.settings.set(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.IN_PLACE,
        false
      );
    });
    cy.get(".error > .close").click();
    cy.get(".warning > .close").click();
    cy.contains("DocumentInFolder").click();
    cy.get("[id^=comprehend-languages_]").click();
    cy.wait(1000);
    cy.get(".close > .fas").click();
    cy.wait(1000);
    cy.contains(/\bTestFolder\b/).click();
    cy.contains("Translated Text").click();
    cy.wait(1000);
    cy.contains("DE_DocumentInFolder").click();
    cy.get(".journal-page-content").should("contain.text", "Translated Text");
    cy.wait(1000);
    cy.get(".close > .fas").click();
    cy.contains("Translated Text").rightclick();
    cy.contains("Delete All").click();
    cy.contains("Yes").click();
  });
});

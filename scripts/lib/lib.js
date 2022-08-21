import { ComprehendLanguagesTranslator } from "./ComprehendLanguagesTranslator.js";
import { ComprehendLanguages } from "./ComprehendLanguages.js";

Hooks.once("init", () => {
  ComprehendLanguages.initialize();
});

Hooks.on("renderJournalSheet", async function (obj, html) {
  if (game.user.isGM) {
    const journal = obj.document;

    let element = html.find(".window-header .window-title");
    if (element.length != 1) return;
    let button = $(
      `<a class="popout" style><i class="fas fa-book"></i>Translate</a>`
    );
    button.on("click", () =>
      ComprehendLanguagesTranslator.constructTranslatedJournalEntry(journal)
    );
    element.after(button);
  }
});

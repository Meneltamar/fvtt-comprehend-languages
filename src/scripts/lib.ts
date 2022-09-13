import { ComprehendLanguagesTranslator } from "./ComprehendLanguagesTranslator";
import { ComprehendLanguages } from "./ComprehendLanguages"; 

declare const Hooks:any
declare const game:Game

Hooks.once("init", () => {
  ComprehendLanguages.initialize();
});

Hooks.on("renderJournalSheet", async function (obj:JournalSheet<JournalEntry>, html) {
  if (game.user.isGM) {
    const journal = obj.document;

    let element = html.find(".window-header .window-title");
    if (element.length != 1) return;
    let button = $(
      `<a class="popout" style><i class="fas fa-book"></i>Translate</a>`
    );
    button.on("click", () =>
      ComprehendLanguagesTranslator.buttonTranslateJournalEntry(journal)
    );
    element.after(button);
  }
});

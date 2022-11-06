import { ComprehendLanguagesTranslator } from "./ComprehendLanguagesTranslator";
import { ComprehendLanguages } from "./ComprehendLanguages"; 

declare const Hooks:any
declare const game:Game

Hooks.once("init", () => {
  ComprehendLanguages.initialize();
});

Hooks.on("renderJournalSheet", async function (app:JournalSheet<JournalEntry>, html, data) {
  addTranslateButton(app);
  // if (game.user.isGM) {
    // const journal = app.document;
    // let element = html.find(".window-title");
    // if (element.length != 1) return;
    // let button = $(
    //   `<a class="popout" style><i class="fas fa-book"></i>Translate</a>`
    // );
    // button.on("click", () =>
    //   ComprehendLanguagesTranslator.buttonTranslateJournalEntry(journal)
    // );
    // element.after(button);
  // }
});

export const addTranslateButton = async function(app) {
  if (!game.user.isGM) {
    return;
  }
  const documentToTranslate = app.document;

  const TIMEOUT_INTERVAL = 50; // ms
    const MAX_TIMEOUT = 1000; // ms
    // Random id to prevent collision with other modules;
    const ID = randomID(24); // eslint-disable-line no-undef
    let waitRender = Math.floor(MAX_TIMEOUT / TIMEOUT_INTERVAL);
    while (
      app._state !== Application.RENDER_STATES.RENDERED && // eslint-disable-line no-undef
      waitRender-- > 0
    ) {
      await new Promise((r) => setTimeout(r, TIMEOUT_INTERVAL));
    }
    // eslint-disable-next-line no-undef
    if (app._state !== Application.RENDER_STATES.RENDERED) {
      console.log("Timeout out waiting for app to render");
      return;
    }

    let domID = appToID(app, ID);
    if (!document.getElementById(domID)) {
      // Don't create a second link on re-renders;
      /* eslint-disable no-undef */
      // class "header-button" is for compatibility with 🦋 Monarch
      let buttonText = game.i18n.localize("Translate");
      if (game && game.settings.get("comprehend-languages", "iconOnly")) {
        buttonText = "";
      }
      const link = $(
        `<a id="${domID}" class="popout"><i class="fas fa-book" title="${game.i18n.localize(
          "Translate"
        )}"></i>${buttonText}</a>`
      );
      /* eslint-enable no-undef */
      link.on("click", () => {
        if(documentToTranslate instanceof JournalEntry) {
          ComprehendLanguagesTranslator.buttonTranslateJournalEntry(documentToTranslate);
        } else if(documentToTranslate instanceof Item){
          ComprehendLanguagesTranslator.buttonTranslateItem(documentToTranslate);
        } else {
          console.error(`comprehend-languages | The document type ${documentToTranslate} is not supported!`);
        }
      });
      // eslint-disable-next-line no-undef
      app.element.find(".window-title").after(link);
      console.log("Attached", app);
    }
}

export const appToID = function(app, ID) {
  const domID = `comprehend-languages_${ID}_${app.appId}`;
  return domID;
}

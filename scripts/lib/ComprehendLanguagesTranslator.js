import { ComprehendLanguages } from "./ComprehendLanguages.js";
export class ComprehendLanguagesTranslator {
  static async translate_text(text, token, target_lang) {
    let data = `auth_key=${token}&text=${text}&target_lang=${target_lang}&source_lang=EN&tag_handling=html`;
    let translation = await fetch(
      "https://api-free.deepl.com/v2/translate?" + data
    )
      .then((response) => response.json())
      .then((respText) => {
        return respText;
      });
    return translation;
  }

  static getTranslationSettings() {
    const token = game.settings.get(
      ComprehendLanguages.ID,
      ComprehendLanguages.SETTINGS.DEEPL_TOKEN
    );
    const target_lang = game.settings.get(
      ComprehendLanguages.ID,
      ComprehendLanguages.SETTINGS.TARGET_LANG
    );
    return { token, target_lang };
  }

  static async translateJournalEntry(journalEntryId) {
    let text = game.journal.get(journalEntryId).data.content;
    text = text.replace("#", "");
    //    let translation = await this.translate_text(jQuery(text).text());
    const { token, target_lang } =
      ComprehendLanguagesTranslator.getTranslationSettings();
    let translation = await this.translate_text(text, token, target_lang);
    return translation.translations[0].text;
  }

  static async constructTranslatedJournalEntry(journalEntry) {
    //console.log(journalEntry);
    if (
      !game.settings.get(
        ComprehendLanguages.ID,
        ComprehendLanguages.SETTINGS.DEEPL_TOKEN
      )
    ) {
      let d = new Dialog({
        title: "DeepL Token missing",
        content:
          "<p>Error: No DeepL token found. <br> Please add a DeepL Token to your Settings</p>",
        buttons: {
          one: {
            icon: '<i class="fas fa-check"></i>',
            label: "OK",
          },
        },
        default: "one",
      });
      d.render(true);
    } else {
      let translatedText = await this.translateJournalEntry(journalEntry.id);
      const target_lang = game.settings.get(
        ComprehendLanguages.ID,
        ComprehendLanguages.SETTINGS.TARGET_LANG
      );
      console.log(translatedText);
      let newJournalEntry = await JournalEntry.create({
        name: target_lang + "_" + journalEntry.name,
        content: translatedText,
        folder: journalEntry.folder,
      });
    }
  }
}

import { ComprehendLanguages } from "./ComprehendLanguages.js";
export class ComprehendLanguagesTranslator {
  static async buttonTranslateJournalEntry(journal) {
    const { token, target_lang } =
      await ComprehendLanguagesTranslator.getTranslationSettings();
    if (!token) {
      this.dialogTokenMissing();
    } else {
      const journalText = await this.getJournalText(journal);
      let translation = await this.translate_text(
        journalText,
        token,
        target_lang
      );
      await this.createNewJournalEntry(journal, translation);
    }
  }

  static async getJournalText(journal) {
    let text = journal.data.content;
    text = text.replace("#", "");
    return text;
  }

  static async createNewJournalEntry(journal, translation) {
    const { token, target_lang } =
      await ComprehendLanguagesTranslator.getTranslationSettings();
    await JournalEntry.create({
      name: target_lang + "_" + journal.name,
      content: translation,
      folder: journal.folder,
    });
  }
  static async translate_text(text, token, target_lang) {
    let data = `auth_key=${token}&text=${text}&target_lang=${target_lang}&source_lang=EN&tag_handling=html`;
    let translation = await fetch(
      "https://api-free.deepl.com/v2/translate?" + data
    )
      .then((response) => response.json())
      .then((respText) => {
        return respText;
      });
    return translation.translations[0].text;
  }

  static async getTranslationSettings() {
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

  static async _split_html(input_HTML) {
    let taglist = [];
    let output_HTML = [];
    [...input_HTML].forEach(function (value, i) {
      switch (["<", ">"].indexOf(value)) {
        case -1: {
          break;
        }
        case 0:
          taglist.push(i);
          break;
        case 1:
          taglist.push(i);
      }
    });
    let even = [],
      uneven = [];
    taglist.forEach((value, index) => {
      if (index % 2 == 0) {
        even.push(value);
      } else {
        uneven.push(value);
      }
    });
    even.forEach((start_idx, index) => {
      const end_idx = uneven[index];
      const next_start_idx = even[index + 1];
      output_HTML.push(input_HTML.substr(start_idx, end_idx + 1 - start_idx));
      if (next_start_idx - end_idx < 2 || isNaN(next_start_idx)) {
      } else {
        output_HTML.push(
          input_HTML.substr(end_idx + 1, even[index + 1] - end_idx - 1)
        );
      }
    });
    return output_HTML;
  }
  static async dialogTokenMissing() {
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
  }
}

import { ComprehendLanguages } from "./ComprehendLanguages"; 
declare const CONST, Dialog: any
declare const game: Game

export class ComprehendLanguagesTranslator {
  static async buttonTranslateJournalEntry(journal: JournalEntry) { 
    const { token, target_lang} =
      await ComprehendLanguagesTranslator.getTranslationSettings();
    if (!token) {
      this.dialogTokenMissing();
    } else {
      const pages = journal.pages
      const newName = target_lang + "_" + journal.name
      const newJournalEntry = await JournalEntry.createDocuments([{...journal, name: newName, folder: journal.folder}])
      const newPages:Array<JournalEntryPage> = await Promise.all(
        pages.map(async (page:JournalEntryPage) => this.translateSinglePage(page,token,target_lang))
        )      
      await newJournalEntry[0].createEmbeddedDocuments("JournalEntryPage",newPages.flat())
    }
  }

  private static async translateSinglePage(journalPage: JournalEntryPage, token: string, target_lang: string) {
    const journalText: string = await this.getJournalPageText(journalPage);
    let translation: string = await this.translate_text(
      journalText,
      token,
      target_lang
    );
    const newJournalPage = await this.createNewJournalEntry(journalPage, translation);
    return newJournalPage  
  }

  static async getJournalPageText(journalPage) {
    if(journalPage.text.content){
    let text:string = journalPage.text.content;
    text = text.replace("#", "");
    return text;}
    else{
      return ''
    } 
    
  }

  static async createNewJournalEntry(journal: JournalEntryPage, translation:string) : Promise<any> {
    const { token, target_lang } =
      await ComprehendLanguagesTranslator.getTranslationSettings();
    const newJournalPage:Array<object> = [{
      ...journal, text:{content: translation, format: CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML}
    }]
    return newJournalPage
    
  }
  static async translate_text(text:string, token:string, target_lang:string): Promise<string> {
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

  static async getTranslationSettings(): Promise<{token: any, target_lang:any}> {
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

  static async _split_html(input_HTML:string) {
    let taglist:Array<number> = [];
    let output_HTML:Array<string> = [];
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
    let even:Array<number> = [],
      uneven:Array<number> = [];
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
      output_HTML.push(input_HTML.slice(start_idx, end_idx+1)); //+ 1 - start_idx));
      if (next_start_idx - end_idx < 2 || isNaN(next_start_idx)) {
      } else {
        output_HTML.push(
          input_HTML.slice(end_idx + 1, even[index + 1]) //- end_idx - 1)
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

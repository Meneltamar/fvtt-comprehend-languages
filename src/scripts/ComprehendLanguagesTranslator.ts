import { ComprehendLanguages } from "./ComprehendLanguages"; 
declare const CONST, Dialog: any
declare const game: Game

interface DeepLTranslation {
  translations: [
    {text: string}
  ]
}

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

  static async buttonTranslateItem(item: Item) { 
    const { token, target_lang} =
      await ComprehendLanguagesTranslator.getTranslationSettings();
    if (!token) {
      this.dialogTokenMissing();
    } else {
      // TODO Not every system has the "description" property on system item
      //@ts-ignore
      if(item.system.description){
        const newName = target_lang + "_" + item.name
        const newDescriptionText =  await this.translate_html(
          //@ts-ignore
          item.system.description.value,
          token,
          target_lang
        );
        //@ts-ignore
        const newItems = <Item[]>await Item.createDocuments([{ ...item, name: newName, folder: item.folder}]);
        if(!newItems || newItems.length <= 0 ) {
          return;
        }
        //@ts-ignore
        // await newItems[0].update({
        //   system: {
        //     description: {
        //       value:
        //     }newDescriptionText
        //   }
        // });
        setProperty(newItems[0].system.description, `value`, newDescriptionText);
      } else {
        // DO NOTHING
        console.warn(`Nothing to translate on the item ${item.name}`);
      }
    }
  }

  private static async translateSinglePage(journalPage: JournalEntryPage, token: string, target_lang: string) {
    const journalText = await this.getJournalPageText(journalPage);
    let translation = await this.translate_html(
      journalText,
      token,
      target_lang
    );
    const newJournalPage = await this.createNewJournalEntry(journalPage, translation);
    return newJournalPage  
  }

  static async getJournalPageText(journalPage) : Promise<string> {
    if(journalPage.text.content){
    let text:string = journalPage.text.content;
    text = text.replace("#", "");
    return text;}
    else{
      return ''
    } 
    
  }

  static async translate_html(long_html:string, token:string, target_lang:string) : Promise<string> {
    // TODO FIX ENTITY LINK BROKEN FROM TRADUCTIOn
    const split_html = this._split_html(long_html)
    let translated_html = split_html.map(async (value) => {
      if(value.startsWith("<")){
        return value
      }else if((value.trim().length) == 0){
        return " "
      }
        else{
        return await this.translate_text(value, token, target_lang)
      }
    })
    const full_string = await Promise.all(translated_html)
    return full_string.join('')
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
    let data = new URLSearchParams(`auth_key=${token}&text=${text}&target_lang=${target_lang}&source_lang=EN&tag_handling=html`);
    // let translation = await fetch(
    //   "https://api-free.deepl.com/v2/translate?" + data,{
    //     mode:'cors',
    //     method:'POST',
    //   }
    // )
    //   .then((response) => response.json())
    //   .then((respText) => {
    //     return respText;
    //   });
    let response = await fetch(
      "https://api-free.deepl.com/v2/translate?" + data,{
        method:'GET',
      }
      )
      let translation:DeepLTranslation = await response.json()
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

  static _split_html(input_HTML:string) {
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

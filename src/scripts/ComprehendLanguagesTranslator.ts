import { ErrorDialog } from "./ErrorDialog";
import {
  _split_at_p,
  _split_html,
  translate_html,
  getTranslationSettings,
  dialogTokenMissing,
  determineFolder,
} from "./lib";
declare const CONST: any;

export interface Translator<T> {
  translateButton(documentToTranslate: T): Promise<void>;
}

export class JournalEntryTranslator implements Translator<JournalEntry> {
  async translateButton(documentToTranslate: JournalEntry): Promise<void> {
    const { token, target_lang, makeSeparateFolder } =
      await getTranslationSettings();
    if (!token) {
      dialogTokenMissing();
    } else {
      const folder = await determineFolder(
        documentToTranslate,
        target_lang,
        makeSeparateFolder
      );
      const pages = documentToTranslate.pages;
      const newName = target_lang + "_" + documentToTranslate.name;
      const newPages = await Promise.all(
        pages.map(async (page: JournalEntryPage) =>
          this.translateSinglePage(page, token, target_lang)
        )
      ).catch((e) => {
        new ErrorDialog(e.message);
      });
      if (newPages) {
        const newJournalEntry = await JournalEntry.createDocuments([
          { ...documentToTranslate, name: newName, folder: folder },
        ]);
        await newJournalEntry[0].createEmbeddedDocuments(
          "JournalEntryPage",
          newPages.flat()
        );
      }
    }
  }

  private async translateSinglePage(
    journalPage: JournalEntryPage,
    token: string,
    target_lang: string
  ): Promise<JournalEntryPage> {
    const journalText = await this.getJournalPageText(journalPage);
    let translation = await translate_html(journalText, token, target_lang);
    const newJournalPage = await this.createNewJournalEntry(
      journalPage,
      translation
    );
    return newJournalPage;
  }

  private async getJournalPageText(journalPage): Promise<string> {
    if (journalPage.text.content) {
      let text: string = journalPage.text.content;
      text = text.replace("#", "");
      return text;
    } else {
      return "";
    }
  }

  private async createNewJournalEntry(
    journal: JournalEntryPage,
    translation: string
  ): Promise<any> {
    const newJournalPage: Array<object> = [
      {
        ...journal,
        text: {
          content: translation,
          format: CONST.JOURNAL_ENTRY_PAGE_FORMATS.HTML,
        },
      },
    ];
    return newJournalPage;
  }
}

export class ItemTranslator implements Translator<Item> {
  async translateButton(documentToTranslate: Item): Promise<void> {
    const { token, target_lang, makeSeparateFolder } =
      await getTranslationSettings();
    if (!token) {
      dialogTokenMissing();
    } else {
      // TODO Not every system has the "description" property on system item
      //@ts-ignore
      if (documentToTranslate.system.description) {
        const newName = target_lang + "_" + documentToTranslate.name;
        const newDescriptionText = await translate_html(
          //@ts-ignore
          documentToTranslate.system.description.value,
          token,
          target_lang
        ).catch((e) => {
          new ErrorDialog(e.message);
        });
        if (!newDescriptionText) {
          return;
        }
        const newFolder = await determineFolder(
          documentToTranslate,
          target_lang,
          makeSeparateFolder
        );
        const newItems = await Item.createDocuments([
          {
            ...documentToTranslate,
            name: newName,
            folder: newFolder,
            type: documentToTranslate.type,
          },
        ]);
        if (!newItems || newItems.length <= 0) {
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
        await newItems[0].update({
          system: { description: { value: newDescriptionText } },
        });
      } else {
        // DO NOTHING
        console.warn(
          `Nothing to translate on the item ${documentToTranslate.name}`
        );
      }
    }
  }
}

export class ComprehendLanguagesTranslator {
  static async buttonTranslateJournalEntry(journal: JournalEntry) {
    const translator = new JournalEntryTranslator();
    translator.translateButton(journal);
  }

  static async buttonTranslateItem(item: Item) {
    const translator = new ItemTranslator();
    translator.translateButton(item);
  }
}

export class SelectionTranslator {
  static async translateSelectedText() {
    const { token, target_lang, makeSeparateFolder } =
      await getTranslationSettings();
    const selectedText = window.getSelection().toString();
    const translatedText = await translate_html(
      selectedText,
      token,
      target_lang
    ).catch((e) => {
      new ErrorDialog(e.message);
    });
    if (!translatedText) {
      return;
    }
    let d = new Dialog({
      title: "Translation",
      content: `<p>${translatedText}</p>`,
      buttons: {
        one: {
          icon: '<i class="fas fa-check"></i>',
          label: "Close Translation",
        },
      },
      default: "one",
    });
    d.render(true);
  }
}

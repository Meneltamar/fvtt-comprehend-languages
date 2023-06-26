import * as foundry from "../../types/foundry/index";
import { SelectionTranslator } from "./ComprehendLanguagesTranslator";
import { addTranslateButton } from "./lib";
import { ComprehendLanguagesStatic } from "./statics";

declare const game: Game;
export class ComprehendLanguages {
  // static ID = "comprehend-languages";

  // static FLAGS = {
  //   COMPREHENDLANGUAGES: "COMPREHENDLANGUAGES",
  // };

  // static SETTINGS = {
  //   DEEPL_TOKEN: "deepl-token",
  //   TARGET_LANG: "target-language",
  //   SUBSETTINGS_MENU: "subsetting-menu",
  //   ICON_ONLY: "iconOnly",
  //   SEPARATE_FOLDER: "separate-folder",
  //   TRANSLATE_FOLDER_NAME: "translate-folder-name",
  //   TRANSLATE_JOURNAL_NAME: "translate-journal-name",
  // };

  static log(force, ...args) {
    const shouldLog =
      force ||
      //      @ts-ignore
      game.modules.get("_dev-mode")?.api?.getPackageDebugValue(this.ID);

    if (shouldLog) {
      console.log(ComprehendLanguagesStatic.ID, "|", ...args);
    }
  }

  static initialize() {
    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.DEEPL_TOKEN,
      {
        name: "DeepL Token",
        config: true,
        hint: "Insert your DeepL Token here",
        type: String,
        default: "",
        scope: "world",
      }
    );

    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.ICON_ONLY,
      {
        name: "Icon Only",
        config: true,
        hint: "If enabled the header button will show with only the icon and no text",
        type: Boolean,
        default: false,
        scope: "world",
      }
    );

    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.SEPARATE_FOLDER,
      {
        name: "Separate Folder",
        config: true,
        hint: "If enabled the translated documents & items will be put into a separate folder.",
        type: Boolean,
        default: false,
        scope: "world",
      }
    );

    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.TRANSLATE_FOLDER_NAME,
      {
        name: "Translate Folder Name",
        config: true,
        hint: "If enabled together with the *Separate Folder* setting, the name of the folder will be translated as well.",
        type: Boolean,
        default: false,
        scope: "world",
      }
    );

    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.TRANSLATE_JOURNAL_NAME,
      {
        name: "Translate Document Names",
        config: true,
        hint: "If enabled the names of Journals, Journal Pages and Items will be translated as well and the language prefix omitted.",
        type: Boolean,
        default: false,
        scope: "world",
      }
    );

    game.settings.register(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.TARGET_LANG,
      {
        name: "Target Language",
        config: true,
        hint: "What should your target language be",
        type: String,
        default: "DE",
        choices: {
          BG: "Bulgarian",
          CS: "Czech",
          DA: "Danish",
          DE: "German",
          EL: "Greek",
          EN: "English",
          ES: "Spanish",
          ET: "Estonian",
          FI: "Finnish",
          FR: "French",
          HU: "Hungarian",
          IT: "Italian",
          JA: "Japanese",
          LT: "Lithuanian",
          LV: "Latvian",
          NL: "Dutch",
          PL: "Polish",
          PT: "Portuguese (all Portuguese varieties mixed)",
          RO: "Romanian",
          RU: "Russian",
          SK: "Slovak",
          SL: "Slovenian",
          SV: "Swedish",
          ZH: "Chinese",
        },
        scope: "world",
      }
    );

    game.keybindings.register(
      ComprehendLanguagesStatic.ID,
      "translate-highlighted-text",
      {
        name: "Translate highlighted text",
        hint: "Translate the currently selected piece of text and pop it out into a Dialog",
        editable: [{ key: "KeyT", modifiers: ["Alt"] }],
        onDown: () => {
          SelectionTranslator.translateSelectedText();
          return true;
        },
      }
    );
    // We replace the games window registry with a proxy object so we can intercept
    // every new application window creation event.
    const handler = {
      ownKeys: (target) => {
        return Reflect.ownKeys(target).filter((app: any) => {
          const appId = parseInt(app);
          if (!isNaN(appId)) {
            // TODO DO SOMETHING ??
            return false;
          }
          return true;
        });
      },
      set: (
        obj: Record<number, Application>,
        prop: number,
        value: FormApplication
      ) => {
        const result = Reflect.set(obj, prop, value);
        // console.log("Intercept ui-window create", value);
        if (value && value.object) {
          if (
            value.object instanceof JournalEntry ||
            value.object instanceof Item
          ) {
            addTranslateButton(value).catch((err) => console.error(err));
          }
        }
        return result;
      },
    };
    //@ts-ignore
    ui.windows = new Proxy(ui.windows, handler); // eslint-disable-line no-undef
    //@ts-ignore
    console.log("Installed window interceptor", ui.windows); // eslint-disable-line no-undef
  }
}

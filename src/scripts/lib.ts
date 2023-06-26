import { ComprehendLanguagesTranslator } from "./ComprehendLanguagesTranslator";
import { ComprehendLanguages } from "./ComprehendLanguages";
import { ComprehendLanguagesStatic } from "./statics";
export interface DeepLTranslation {
  translations: [{ text: string }];
}
declare const Hooks: any;
declare const game: Game;

Hooks.once("init", () => {
  ComprehendLanguages.initialize();
});

export const addTranslateButton = async function (app) {
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
      if (documentToTranslate instanceof JournalEntry) {
        ComprehendLanguagesTranslator.buttonTranslateJournalEntry(
          documentToTranslate
        );
      } else if (documentToTranslate instanceof Item) {
        ComprehendLanguagesTranslator.buttonTranslateItem(documentToTranslate);
      } else {
        console.error(
          `comprehend-languages | The document type ${documentToTranslate} is not supported!`
        );
      }
    });
    // eslint-disable-next-line no-undef
    app.element.find(".window-title").after(link);
    // console.log("Attached", app);
  }
};

export const appToID = function (app, ID) {
  const domID = `comprehend-languages_${ID}_${app.appId}`;
  return domID;
};

export function _split_html(input_HTML: string) {
  let taglist: Array<number> = [];
  let output_HTML: Array<string> = [];
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
  let even: Array<number> = [],
    uneven: Array<number> = [];
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
    output_HTML.push(input_HTML.slice(start_idx, end_idx + 1)); //+ 1 - start_idx));
    if (next_start_idx - end_idx < 2 || isNaN(next_start_idx)) {
    } else {
      output_HTML.push(
        input_HTML.slice(end_idx + 1, even[index + 1]) //- end_idx - 1)
      );
    }
  });
  return output_HTML;
}

export function _split_at_p(inputHTML: string): Array<string> {
  let outputArray = inputHTML.split("</p>");
  outputArray = outputArray
    .filter((element) => {
      return element.length > 0;
    })
    .map((element) => {
      if (element.startsWith("<p")) {
        return element + "</p>";
      } else {
        return element;
      }
    });
  return outputArray;
}

export async function translate_html(
  long_html: string,
  token: string,
  target_lang: string
): Promise<string> {
  const split_html = _split_at_p(long_html);
  let translated_html = split_html.map(async (value) => {
    return await translate_text(value, token, target_lang);
  });
  const full_string = await Promise.all(translated_html);
  return full_string.join("");
}

export async function translate_text(
  text: string,
  token: string,
  target_lang: string
): Promise<string> {
  // TODO Find a better method this is a retrocompatibility fix for issue #9 and fvtt 9
  let newText = text;
  newText = replaceAll(newText, `@Scene[`, `@UUID[Scene.`);
  newText = replaceAll(newText, `@Actor[`, `@UUID[Actor.`);
  newText = replaceAll(newText, `@Item[`, `@UUID[Item.`);
  newText = replaceAll(newText, `@JournalEntry[`, `@UUID[JournalEntry.`);
  newText = replaceAll(newText, `@RollTable[`, `@UUID[RollTable.`);
  newText = replaceAll(newText, `@Cards[`, `@UUID[Cards.`);
  newText = replaceAll(newText, `@Folder[`, `@UUID[Folder.`);
  newText = replaceAll(newText, `@Playlist[`, `@UUID[Playlist.`);
  newText = replaceAll(newText, `@Compendium[`, `@UUID[Compendium.`);

  let data = new URLSearchParams(
    `auth_key=${token}&text=${encodeURIComponent(
      newText
    )}&target_lang=${target_lang}&source_lang=EN&tag_handling=html`
  );

  let response = await fetch(
    "https://api-free.deepl.com/v2/translate?" + data,
    {
      method: "GET",
    }
  );
  if (response.status == 200) {
    let translation: DeepLTranslation = await response.json();
    return translation.translations[0].text;
  } else if (response.status == 456) {
    throw new Error(
      "You have exceeded your monthly DeepL API quota. You will be able to continue translating next month. For more information, check your account on the DeepL website."
    );
  } else if (response.status == 401 || response.status == 403) {
    throw new Error("Your token is invalid. Please check your DeepL Token.");
  } else {
    throw new Error("Unknown Error");
  }
}

export function replaceAll(string, search, replace) {
  return string.split(search).join(replace);
}

export async function getTranslationSettings(): Promise<{
  token: string;
  target_lang: string;
  makeSeparateFolder: boolean;
}> {
  const token = game.settings.get(
    ComprehendLanguagesStatic.ID,
    ComprehendLanguagesStatic.SETTINGS.DEEPL_TOKEN
  ) as string;
  const target_lang = game.settings.get(
    ComprehendLanguagesStatic.ID,
    ComprehendLanguagesStatic.SETTINGS.TARGET_LANG
  ) as string;
  const makeSeparateFolder = game.settings.get(
    ComprehendLanguagesStatic.ID,
    ComprehendLanguagesStatic.SETTINGS.SEPARATE_FOLDER
  ) as boolean;
  return { token, target_lang, makeSeparateFolder };
}

export async function dialogTokenMissing() {
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

export async function determineFolder(
  translatable: JournalEntry | Item,
  target_lang: string,
  makeSeparateFolder: boolean
): Promise<Folder<EnfolderableDocument>> {
  if (makeSeparateFolder) {
    if (!translatable.folder) {
      return null;
    }
    let oldFolderName = translatable.folder.name;
    if (
      game.settings.get(
        ComprehendLanguagesStatic.ID,
        ComprehendLanguagesStatic.SETTINGS.TRANSLATE_FOLDER_NAME
      )
    ) {
      var newFolderName = await translate_text(
        oldFolderName,
        game.settings.get(
          ComprehendLanguagesStatic.ID,
          ComprehendLanguagesStatic.SETTINGS.DEEPL_TOKEN
        ) as string,
        game.settings.get(
          ComprehendLanguagesStatic.ID,
          ComprehendLanguagesStatic.SETTINGS.TARGET_LANG
        ) as string
      );
    } else {
      var newFolderName = target_lang + "_" + oldFolderName;
    }
    let folderType = translatable.folder.type as "JournalEntry" | "Item";
    let existingFolder = game.folders.filter((folder) => {
      return folder.name == newFolderName && folder.type == folderType;
    });
    if (existingFolder.length == 0) {
      var newFolders = await Folder.createDocuments([
        { name: newFolderName, type: folderType },
      ]);
      var newFolder = newFolders[0] as Folder;
    } else {
      var newFolder = existingFolder[0];
    }
  } else {
    var newFolder = translatable.folder;
  }
  return newFolder;
}

export async function determineNewName(
  documentToTranslate: JournalEntry | JournalEntryPage | Item
) {
  const { token, target_lang, makeSeparateFolder } =
    await getTranslationSettings();
  let newName: string;
  if (
    game.settings.get(
      ComprehendLanguagesStatic.ID,
      ComprehendLanguagesStatic.SETTINGS.TRANSLATE_JOURNAL_NAME
    )
  ) {
    newName = await translate_text(
      documentToTranslate.name,
      token,
      target_lang
    );
  } else {
    if (documentToTranslate instanceof JournalEntryPage) {
      return documentToTranslate.name;
    }
    newName = target_lang + "_" + documentToTranslate.name;
  }
  return newName;
}

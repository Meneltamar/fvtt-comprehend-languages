export class ComprehendLanguages {
  static ID = "comprehend-languages";

  static FLAGS = {
    COMPREHENDLANGUAGES: "COMPREHENDLANGUAGES",
  };

  static SETTINGS = {
    DEEPL_TOKEN: "deepl-token",
    TARGET_LANG: "target-language",
    SUBSETTINGS_MENU: "subsetting-menu",
  };

  static log(force, ...args) {
    const shouldLog =
      force ||
      game.modules.get("_dev-mode")?.api?.getPackageDebugValue(this.ID);

    if (shouldLog) {
      console.log(this.ID, "|", ...args);
    }
  }

  static initialize() {
    game.settings.register(this.ID, this.SETTINGS.DEEPL_TOKEN, {
      name: "DeepL Token",
      config: true,
      hint: "Insert your DeepL Token here",
      type: String,
      default: "",
      scope: "world",
    });
    game.settings.register(this.ID, this.SETTINGS.TARGET_LANG, {
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
    });
  }
}

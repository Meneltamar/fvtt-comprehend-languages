class ComprehendLanguages {
    static ID = 'comprehend-languages';
    
    static FLAGS = {
        COMPREHENDLANGUAGES : 'COMPREHENDLANGUAGES'
    }

    static SETTINGS = {
        DEEPL_TOKEN : 'deepl-token'
    }

    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }

    static initialize() {
        this.ComprehendLanguagesTranslator = new ComprehendLanguagesTranslator();
        game.settings.register(this.ID, this.SETTINGS.DEEPL_TOKEN,{
            name: 'DeepL Token',
            config: true,
            hint: "Insert your DeepL Token here",
            type: String,
            default: '',
            scope: "world"
        })
    }

}
Hooks.once('init', () => {
    ComprehendLanguages.initialize();
})

Hooks.on("renderJournalSheet", async function (obj, html) {
    // Only inject the link if the actor is of type "character" and the user has permission to update it
    const journal = obj.document;
  
    let element = html.find(".window-header .window-title");
    if (element.length != 1) return;
    let button = $(
    `<a class="popout" style><i class="fas fa-book"></i>Translate</a>`
    );
    button.on("click", () => ComprehendLanguagesTranslator.constructTranslatedJournalEntry(journal));
    element.after(button);
  });

class ComprehendLanguagesTranslator {
    static async translate_text(text) {
        const token = game.settings.get(ComprehendLanguages.ID,ComprehendLanguages.SETTINGS.DEEPL_TOKEN)
        let data = `auth_key=${token}&text=${text}&target_lang=DE&source_lang=EN`
        //return response.json();
        let translation = await fetch('https://api-free.deepl.com/v2/translate?'+data)
        .then(response => response.json())
        .then(respText => {
            return respText 
        })
        return translation
    }

    static async translateJournalEntry(journalEntryId){
        let text = game.journal.get(journalEntryId).data.content
        let translation = await this.translate_text(jQuery(text).text());
        return translation.translations[0].text
    }

    static async constructTranslatedJournalEntry(journalEntry){
        //console.log(journalEntry);
        let translatedText = await this.translateJournalEntry(journalEntry.id)
        console.log(translatedText)
        let newJournalEntry = await JournalEntry.create({
            name : "de_"+journalEntry.name,
            content : translatedText,
            folder : journalEntry.folder
        })
    }
    
    
}
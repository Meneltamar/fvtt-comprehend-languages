class ComprehendLanguages {
    static ID = 'comprehend-languages';
    
    static FLAGS = {
        COMPREHENDLANGUAGES : 'COMPREHENDLANGUAGES'
    }

    static log(force, ...args) {  
        const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);
    
        if (shouldLog) {
          console.log(this.ID, '|', ...args);
        }
    }

    static initialize() {
        this.ComprehendLanguagesTranslator = new ComprehendLanguagesTranslator();
    }

}
Hooks.once('init', () => {
    ComprehendLanguages.initialize();
})

class ComprehendLanguagesTranslator {
    static async translate_text(text) {
        const token = 'a8b74c12-a45e-6010-4fcf-a397c86d2d68:fx'
        let data = `auth_key=${token}&text=${text}&target_lang=DE&source_lang=EN`
        //return response.json();
        let translation = await fetch('https://api-free.deepl.com/v2/translate?'+data)
        .then(response => response.json())
        .then(respText => {
            return respText 
        })
        return translation
    }
}
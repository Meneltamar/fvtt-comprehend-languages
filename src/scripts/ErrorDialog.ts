export class ErrorDialog {
  title = "Error during translation";
  buttons = {
    one: {
      icon: '<i class="fas fa-check"></i>',
      label: "OK",
    },
  };
  default = "one";

  constructor(content: string) {
    let d = new Dialog({
      title: this.title,
      content: `<p> ${content} </p>`,
      buttons: this.buttons,
      default: this.default,
    });
    d.render(true);
  }
}

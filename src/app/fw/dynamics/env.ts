export class Env {

  static CN: string = "Cn";
  static EN: string = "En";
  static IT: string = "It";

  static POSSIBLE_LANGS: Array<string> = ["It", /*"Cn", "En", "Fr", "De", "Es"*/];
  static POSSIBLE_LANG_NAMES: { [key: string]: string } = {
    "It": "Italiano",
    "Cn": "简体中文",
    // "En": "English",
    // "Fr": "Français",
    // "De": "Deutsch",
    // "Es": "Spanish"
  };

  constructor() { }

}

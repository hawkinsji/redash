// (c) 2020 The ACE Centre-North, UK registered charity 1089313.
// MIT licensed, see https://opensource.org/licenses/MIT
//
/*
 *
 *
*/

import MessageDisplay from "./messageDisplay.js";

export default class Factory {
    constructor(limits,keyboardMode) {
      this._limits = limits;
      this._keyboardMode = keyboardMode;
      //Message Display
      this._messageDisplay = new MessageDisplay(this._limits);
    }

    get messageDisplay() { return this._messageDisplay;}

    load(loadingID,header){
      this._messageDisplay.load(header,this._keyboardMode);
    }


    _load_display_controls(){
        const panel = this.panels.display;
        panel.popup.listener = this.clicked_popup.bind(this);
    }

    clicked_popup() {
        this._messageDisplay.popupClicked();
    }
}

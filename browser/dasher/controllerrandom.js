// (c) 2020 The ACE Centre-North, UK registered charity 1089313.
// MIT licensed, see https://opensource.org/licenses/MIT

import ZoomBox from "./zoombox.js";

const emptyArray = [];

export default class ControllerRandom {
    constructor(texts, palette) {
        this._texts = texts;
        this._palette = palette;

        this._going = true;
        this._rootSpecification = {"factory":this, "factoryData": true};
    }

    get rootSpecification() {return this._rootSpecification;}

    async specify_child_boxes(zoomBox) {
        return zoomBox.factoryData ? this._texts.map((character, index) => {
            const xChange = 1 - ((index % 2) * 2);
            return {
                "colour": null,
                "cssClass":
                    `${this._palette.sequenceStubCSS}-${index % 2}-0`,
                "text": character, message: [character.codePointAt(0)],
                "weight": 1,
                "controllerData": {"xChange":xChange, "yChange":xChange},
                "factory":this, "factoryData": false
            };
        }) : emptyArray;
    }

    get going() {return this._going;}
    set going(going) {this._going = going;}

    control(rootBox) {
        if (!this.going) {
            return;
        }

        const heightMin = this._rectHeight * 0.75;
        const heightMax = this._rectHeight * 1.75;
        const widthMin = this._rectHeight * 2;
        const widthMax = rootBox.width;
        let top = rootBox.top;
        rootBox.each_childBox(zoomBox => {
            const xChange = zoomBox.controllerData.xChange;
            const yChange = zoomBox.controllerData.yChange;
            const xDelta = (50 + Math.random() * 250) * xChange;
            const yDelta = heightMin * Math.random() * yChange;

            let left;
            let width = zoomBox.width + xDelta;
            if (
                (width < widthMin && xChange < 0) ||
                (width > widthMax && xChange > 0)
            ) {
                // Reverse direction; don't move.
                zoomBox.controllerData.xChange *= -1;
                width = undefined;
            }
            else {
                left = (rootBox.left + rootBox.width) - width;
            }

            let height = zoomBox.height;
            if (
                (height + yDelta < heightMin && yChange < 0) ||
                (height + yDelta > heightMax && yChange > 0)
            ) {
                // Reverse direction, don't change height. But, top will
                // still have to change because adjacent child boxes will
                // have moved probably.
                zoomBox.controllerData.yChange *= -1;
            }
            else {
                height += yDelta;
            }

            zoomBox.set_dimensions(left, width, top + (height / 2), height);

            top += height;
        });

    }

    populate(rootBox) {
        this._rectHeight = (rootBox.height / rootBox.childCount) * 0.75;

        let top = rootBox.top;
        const width = this._rectHeight * 2;
        const left = (rootBox.left + rootBox.width) - width;
        rootBox.childSpecifications.forEach((specification, index) => {
            const zoomBox = new ZoomBox(specification);
            zoomBox.set_dimensions(
                left, width, top + (this._rectHeight / 2), this._rectHeight
            );
            top += this._rectHeight;

            rootBox.childBoxes[index] = zoomBox;
        });
    }
}

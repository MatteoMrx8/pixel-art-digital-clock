import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as fs from "fs";
import { locales } from "./locales/it.js";
import { FitFont } from 'fitfont';

export default class clock_controller {
    separator_showed = true;

    dh_element = null;
    uh_element = null;
    dm_element = null;
    um_element = null;

    constructor() {
        // Update the clock every seconds
        clock.granularity = "seconds";

        // Get a handle on clock elements for 24h
        this.dh_24 = document.getElementById("dh-24");
        this.uh_24 = document.getElementById("uh-24");
        this.dm_24 = document.getElementById("dm-24");
        this.um_24 = document.getElementById("um-24");

        // Get a handle on clock elements for 12h
        this.dh_12 = document.getElementById("dh-12");
        this.uh_12 = document.getElementById("uh-12");
        this.dm_12 = document.getElementById("dm-12");
        this.um_12 = document.getElementById("um-12");

        this.clock_12_section = document.getElementById("clock-12h");
        this.clock_24_section = document.getElementById("clock-24h");

        this.date_element = new FitFont({
            id: 'date', // id of your symbol in the index.gui, you can also give an element object e.g. id: document.getElementById('foo')
            font: 'Fixedsys_Excelsior_3_01_28', // name of the generated font folder

            // Optional
            halign: 'middle', // horizontal alignment : start / middle / end
            valign: 'baseline', // vertical alignment   : baseline / top / middle / bottom
            letterspacing: 0            // letterspacing...
        });

        if (preferences.clockDisplay === "12h") {
            this.clock_24_section.style.display = "none";
        } else {
            this.clock_12_section.style.display = "none";
        }

        this.am_pm = document.getElementById("am-pm");

        this.separators = document.getElementsByClassName('separator');

        // Update clock element every tick with the current time
        clock.addEventListener('tick', (evt) => {
            let today = evt.date;
            let hours = today.getHours();

            let weekDay = today.getDay();
            let day = today.getDate();
            let month = today.getMonth();
            let year = today.getFullYear();

            this.date_element.text = locales.weekDayShort[weekDay] + " " + day + " " + locales.month[month] + " " + year;

            if (this.separator_showed) {
                for (let separator of this.separators) {
                    separator.href = "img/separator_hidden.png.txi"
                }

                this.separator_showed = false;
            } else {
                for (let separator of this.separators) {
                    separator.href = "img/separator.png.txi"
                }
                this.separator_showed = true;
            }

            if (preferences.clockDisplay === "12h") {
                this.clock_12_section.style.display = "inline";
                this.clock_24_section.style.display = "none";

                this.dh_element = this.dh_12;
                this.uh_element = this.uh_12;
                this.dm_element = this.dm_12;
                this.um_element = this.um_12;
            } else {
                this.clock_12_section.style.display = "none";
                this.clock_24_section.style.display = "inline";

                this.dh_element = this.dh_24;
                this.uh_element = this.uh_24;
                this.dm_element = this.dm_24;
                this.um_element = this.um_24;
            }

            if (preferences.clockDisplay === "12h") {
                if (hours > 12) {
                    this.am_pm.href = "img/12h/PM.png.txi";
                } else {
                    this.am_pm.href = "img/12h/AM.png.txi";
                }

                // 12h format
                hours = hours % 12 || 12;
            } //else {
            // 24h format
            hours = util.zeroPad(hours);
            // }
            let mins = util.zeroPad(today.getMinutes());

            let dh = String(hours).charAt(0);
            let uh = String(hours).charAt(1);
            let dm = String(mins).charAt(0);
            let um = String(mins).charAt(1);

            let dh_img = this.getNumberImg(dh);
            let uh_img = this.getNumberImg(uh);
            let dm_img = this.getNumberImg(dm);
            let um_img = this.getNumberImg(um);

            this.dh_element.href = dh_img;
            this.uh_element.href = uh_img;
            this.dm_element.href = dm_img;
            this.um_element.href = um_img;
        });
    }

    getNumberImg(num) {
        let img = "img/" + preferences.clockDisplay + "/" + num + ".png.txi";

        if (!fs.existsSync("/mnt/assets/resources/" + img)) {
            img = "img/" + preferences.clockDisplay + "/not-found.png.txi";
        }

        return img;
    }
}
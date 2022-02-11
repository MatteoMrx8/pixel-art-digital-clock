import clock from "clock";
import * as document from "document";
import { preferences } from "user-settings";
import * as util from "../common/utils";
import * as fs from "fs";
import { locales } from "./locales/it.js";
import { FitFont } from 'fitfont';

export default function clock_controller() {
    // Update the clock every seconds
    clock.granularity = "seconds";

    // Get a handle on clock elements for 24h
    const dh_24 = document.getElementById("dh-24");
    const uh_24 = document.getElementById("uh-24");
    const dm_24 = document.getElementById("dm-24");
    const um_24 = document.getElementById("um-24");

    // Get a handle on clock elements for 12h
    const dh_12 = document.getElementById("dh-12");
    const uh_12 = document.getElementById("uh-12");
    const dm_12 = document.getElementById("dm-12");
    const um_12 = document.getElementById("um-12");

    const clock_12_section = document.getElementById("clock-12h");
    const clock_24_section = document.getElementById("clock-24h");

    const date_element = new FitFont({
        id: 'date', // id of your symbol in the index.gui, you can also give an element object e.g. id: document.getElementById('foo')
        font: 'Fixedsys_Excelsior_3_01_28', // name of the generated font folder

        // Optional
        halign: 'middle', // horizontal alignment : start / middle / end
        valign: 'baseline', // vertical alignment   : baseline / top / middle / bottom
        letterspacing: 0            // letterspacing...
    });

    if (preferences.clockDisplay === "12h") {
        clock_24_section.style.display = "none";
    } else {
        clock_12_section.style.display = "none";
    }

    const am_pm = document.getElementById("am-pm");

    const separators = document.getElementsByClassName('separator');
    var separator_showed = true;

    var dh_element = null;
    var uh_element = null;
    var dm_element = null;
    var um_element = null;

    // Update clock element every tick with the current time
    clock.addEventListener('tick', (evt) => {
        let today = evt.date;
        let hours = today.getHours();

        let weekDay = today.getDay();
        let day = today.getDate();
        let month = today.getMonth();
        let year = today.getFullYear();

        date_element.text = locales.weekDayShort[weekDay] + " " + day + " " + locales.month[month] + " " + year;

        if (separator_showed) {
            for (let separator of separators) {
                separator.href = "img/separator_hidden.png.txi"
            }

            separator_showed = false;
        } else {
            for (let separator of separators) {
                separator.href = "img/separator.png.txi"
            }
            separator_showed = true;
        }

        if (preferences.clockDisplay === "12h") {
            clock_12_section.style.display = "inline";
            clock_24_section.style.display = "none";

            dh_element = dh_12;
            uh_element = uh_12;
            dm_element = dm_12;
            um_element = um_12;
        } else {
            clock_12_section.style.display = "none";
            clock_24_section.style.display = "inline";

            dh_element = dh_24;
            uh_element = uh_24;
            dm_element = dm_24;
            um_element = um_24;
        }

        if (preferences.clockDisplay === "12h") {
            if (hours > 12) {
                am_pm.href = "img/12h/PM.png.txi";
            } else {
                am_pm.href = "img/12h/AM.png.txi";
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

        let dh_img = getNumberImg(dh);
        let uh_img = getNumberImg(uh);
        let dm_img = getNumberImg(dm);
        let um_img = getNumberImg(um);

        dh_element.href = dh_img;
        uh_element.href = uh_img;
        dm_element.href = dm_img;
        um_element.href = um_img;
    });

    function getNumberImg(num) {
        let img = "img/" + preferences.clockDisplay + "/" + num + ".png.txi";

        if (!fs.existsSync("/mnt/assets/resources/" + img)) {
            img = "img/" + preferences.clockDisplay + "/not-found.png.txi";
        }

        return img;
    }
}
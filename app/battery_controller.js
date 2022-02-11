import * as document from "document";
import { battery, charger } from "power";
import { FitFont } from 'fitfont';

export default class battery_controller {

    upper_delta = 12;
    bottom_delta = 9;

    constructor() {
        this.battery_level_element = new FitFont({
            id: 'battery-level', // id of your symbol in the index.gui, you can also give an element object e.g. id: document.getElementById('foo')
            font: 'Fixedsys_Excelsior_3_01_20', // name of the generated font folder

            // Optional
            halign: 'middle', // horizontal alignment : start / middle / end
            valign: 'baseline', // vertical alignment   : baseline / top / middle / bottom
            letterspacing: 0            // letterspacing...
        });

        this.battery_logo_charging = document.getElementById("battery-logo-charging");
        this.battery_logo_full = document.getElementById("battery-logo-full");
        this.battery_level_mask = document.getElementById("battery-level-mask");
        this.battery_level_svg = document.getElementById("battery-level-svg");

        battery.onchange = () => {
            this.updateBatteryLevel()
        }

        this.updateBatteryLevel()
    }

    updateBatteryLevel() {
        let batteryLevel = Math.floor(battery.chargeLevel);

        this.battery_level_element.text = batteryLevel + " %";

        if (batteryLevel > 35) {
            this.battery_level_element.style.fill = "green";
            this.battery_logo_full.style.fill = "green";
        } else if (batteryLevel > 25) {
            this.battery_level_element.style.fill = "orange";
            this.battery_logo_full.style.fill = "orange";
        } else {
            this.battery_level_element.style.fill = "red";
            this.battery_logo_full.style.fill = "red";
        }

        let battery_height = this.battery_level_svg.height - this.upper_delta - this.bottom_delta;
        let mask_height = (battery_height * batteryLevel) / 100;
        this.battery_level_mask.height = mask_height;
        this.battery_level_mask.y = this.battery_level_svg.height - mask_height - this.bottom_delta;

        if (battery.charging) {
            this.battery_logo_charging.style.opacity = 1;
        } else {
            this.battery_logo_charging.style.opacity = 0;
        }
    }
}
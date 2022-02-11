import * as document from "document";
import { battery, charger } from "power";
import { FitFont } from 'fitfont';

export default function battery_controller() {
    const upper_delta = 12;
    const bottom_delta = 9;

    const battery_level_element = new FitFont({
        id: 'battery-level', // id of your symbol in the index.gui, you can also give an element object e.g. id: document.getElementById('foo')
        font: 'Fixedsys_Excelsior_3_01_20', // name of the generated font folder

        // Optional
        halign: 'middle', // horizontal alignment : start / middle / end
        valign: 'baseline', // vertical alignment   : baseline / top / middle / bottom
        letterspacing: 0            // letterspacing...
    });
    const battery_logo_charging = document.getElementById("battery-logo-charging");
    const battery_logo_full = document.getElementById("battery-logo-full");
    const battery_level_mask = document.getElementById("battery-level-mask");
    const battery_level_svg = document.getElementById("battery-level-svg");

    battery.onchange = () => {
        updateBatteryLevel()
    }

    function updateBatteryLevel() {
        let batteryLevel = Math.floor(battery.chargeLevel);

        battery_level_element.text = batteryLevel + " %";

        if (batteryLevel > 35) {
            battery_level_element.style.fill = "green";
//            battery_logo.style.fill = "green";
            battery_logo_full.style.fill = "green";
        } else if (batteryLevel > 25) {
            battery_level_element.style.fill = "orange";
//            battery_logo.style.fill = "orange";
            battery_logo_full.style.fill = "orange";
        } else {
            battery_level_element.style.fill = "red";
//            battery_logo.style.fill = "red";
            battery_logo_full.style.fill = "red";
        }

        let battery_height = battery_level_svg.height - upper_delta - bottom_delta;
        let mask_height = (battery_height * batteryLevel) / 100;
        battery_level_mask.height = mask_height;
        battery_level_mask.y = battery_level_svg.height - mask_height - bottom_delta;

        if (battery.charging) {
            battery_logo_charging.style.opacity = 1;
        } else {
            battery_logo_charging.style.opacity = 0;
        }
    }

    updateBatteryLevel()
}
import * as document from "document";
import { me as appbit } from "appbit";
import { display } from "display";
import { HeartRateSensor } from "heart-rate";
import { FitFont } from 'fitfont';

export default class heartRate_controller {

    bpm = 0;

    constructor() {
        this.hr_element = new FitFont({
            id: 'heart-rate', // id of your symbol in the index.gui, you can also give an element object e.g. id: document.getElementById('foo')
            font: 'Fixedsys_Excelsior_3_01_20', // name of the generated font folder

            // Optional
            halign: 'middle', // horizontal alignment : start / middle / end
            valign: 'baseline', // vertical alignment   : baseline / top / middle / bottom
            letterspacing: 0            // letterspacing...
        });
        this.hr_logo_animations = document.getElementsByClassName("heart-rate-animation");

        if (HeartRateSensor && appbit.permissions.granted("access_heart_rate")) {
            const hrm = new HeartRateSensor();
            hrm.addEventListener("reading", () => {
                this.bpm = hrm.heartRate;

                this.hr_element.text = this.bpm + " bpm";

                this.updateHeartLogoAnimation();
            });
            display.addEventListener("change", () => {
                // Automatically stop the sensor when the screen is off to conserve battery
                display.on ? hrm.start() : hrm.stop();
            });
            hrm.start();
        }
    }

    updateHeartLogoAnimation() {
        let duration = 60 / this.bpm;

        for (let animation of this.hr_logo_animations) {
            animation.dur = duration;
        }
    }
}
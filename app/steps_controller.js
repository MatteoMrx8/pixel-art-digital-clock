import * as document from "document";
import { me as appbit } from "appbit";
import { today } from 'user-activity';
import clock from "clock";
import { FitFont } from 'fitfont';

export default class steps_controller {

    last_steps = 0;

    constructor() {
        if (!appbit.permissions.granted("access_activity")) {
            throw Exception('Activity permission required!');
        }

        this.steps_element = new FitFont({
            id: 'steps-counter', // id of your symbol in the index.gui, you can also give an element object e.g. id: document.getElementById('foo')
            font: 'Fixedsys_Excelsior_3_01_20', // name of the generated font folder

            // Optional
            halign: 'middle', // horizontal alignment : start / middle / end
            valign: 'baseline', // vertical alignment   : baseline / top / middle / bottom
            letterspacing: 0            // letterspacing...
        });

        this.left_arm = document.getElementById('omino-arm-left');
        this.right_arm = document.getElementById('omino-arm-right');
        this.left_leg = document.getElementById('omino-leg-left');
        this.right_leg = document.getElementById('omino-leg-right');

        clock.granularity = "seconds";
        
        // Update clock element every tick with the current time
        clock.addEventListener('tick', (evt) => {
            this.steps_element.text = today.adjusted.steps + ' s';

            if (this.last_steps != today.adjusted.steps) {
                this.last_steps = today.adjusted.steps;

                this.left_arm.animate('enable');
                this.right_arm.animate('enable');
                this.left_leg.animate('enable');
                this.right_leg.animate('enable');
            }
        });
    }
}
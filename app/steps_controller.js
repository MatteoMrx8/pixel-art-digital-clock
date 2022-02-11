import * as document from "document";
import { me as appbit } from "appbit";
import { today } from 'user-activity';
import clock from "clock";
import { FitFont } from 'fitfont';

export default function steps_controller() {
    if (!appbit.permissions.granted("access_activity")) {
        throw Exception('Activity permission required!');
    }
    
    const steps_element = new FitFont({
        id: 'steps-counter', // id of your symbol in the index.gui, you can also give an element object e.g. id: document.getElementById('foo')
        font: 'Fixedsys_Excelsior_3_01_20', // name of the generated font folder

        // Optional
        halign: 'middle', // horizontal alignment : start / middle / end
        valign: 'baseline', // vertical alignment   : baseline / top / middle / bottom
        letterspacing: 0            // letterspacing...
    });
    
    const left_arm = document.getElementById('omino-arm-left');
    const right_arm = document.getElementById('omino-arm-right');
    const left_leg = document.getElementById('omino-leg-left');
    const right_leg = document.getElementById('omino-leg-right');
    
    var last_steps = 0;
    
    clock.granularity = "seconds";
    
    // Update clock element every tick with the current time
    clock.addEventListener('tick', (evt) => {
        steps_element.text = today.adjusted.steps + ' s';
        
        if (last_steps != today.adjusted.steps) {
            last_steps = today.adjusted.steps;
            
            left_arm.animate('enable');
            right_arm.animate('enable');
            left_leg.animate('enable');
            right_leg.animate('enable');
        }
    });
}
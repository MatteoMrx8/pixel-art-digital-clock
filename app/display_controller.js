import { me as appbit } from "appbit";
import { display } from "display";
import clock from "clock";

export default class display_controller {

    constructor() {
        if (display.aodAvailable && appbit.permissions.granted("access_aod")) {
            // tell the system we support AOD
//            display.aodAllowed = true;
        }

        // respond to display change events
        display.addEventListener("change", () => {
            // Is AOD inactive and the display is on?
            if (!display.aodActive && display.on) {
                clock.granularity = "seconds";
                // Show elements & start sensors
                // someElement.style.display = "inline";
                // hrm.start();
            } else {
//                clock.granularity = "minutes";
                // Hide elements & stop sensors
                // someElement.style.display = "none";
                // hrm.stop();
            }
        });
    }
}
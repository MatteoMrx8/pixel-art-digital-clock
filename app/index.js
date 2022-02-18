import display_controller from "./display_controller";
import clock_controller from "./clock_controller";
import heartRate_controller from "./hr_controller";
import battery_controller from "./battery_controller";
import steps_controller from "./steps_controller";

let clock_obj = new clock_controller();
let hr_obj = new heartRate_controller();
let battery_obj = new battery_controller();
let steps_obj = new steps_controller();
let display_obj = new display_controller();
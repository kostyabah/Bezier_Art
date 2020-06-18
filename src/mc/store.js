
import {state, computed} from "./state"
import * as updater from "./updater"
//import * as comput from "./comput"
let del = index => (item, i) => index !== i;
let replace = (value, index) => (item, i) => index == i ? value : item;

export default [state, computed, updater]
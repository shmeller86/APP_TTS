import {combineReducers} from 'redux';
import OptionsReducers from './options';


const allReducers = combineReducers({
    options: OptionsReducers,

});

export default allReducers;
/**
 * Created by che on 05.03.2018.
 */
export const INITIAL_STATE =
        {
            isLoggedIn: false,
            isLoading: true,
            isAvaliableApi: false,
            api: {
                server: '',
                version: 1,
                login: '',
                password: '',
                token: '',
                secret: '',
                result: {}
            },
            data: {
                radius_activate: 1000,
                distance_a: null,
                distance_b: null,
                active_a: null,
                active_b:null
            },
            metric: {
                ttn_number: null,
                ttn_weight: null,
                empty_weight_a: null,
                empty_weight_b: null,
                full_weight_a: null,
                full_weight_b: null,
                dt_arrival_a: null,
                dt_loading_a: null,
                dt_departure_a: null,
                dt_arrival_b: null,
                dt_loading_b: null,
                point_a_finish: false,
                point_b_finish: false
            },
            vehicle: {},
            vehicle_loading: true
        };



export default function (state = INITIAL_STATE, action) {
    switch (action.type) {
        case 'IS_AVALIABLE_API':
            console.log('Изменен статус API на ' + action.payload);
            return {
                ...state,
                isAvaliableApi: action.payload
            }
        case 'IS_LOADING':
            console.log('Изменен статус загрузки на ' + action.payload);
            return {
                ...state,
                isLoading: action.payload
            }
        case 'ADD_VEHICLE':
            console.log('Обновление списка машин');
            return {
                ...state,
                vehicle: action.payload
            }
        case 'IS_VEHICLE_LOADING':
            console.log('Изменение статуса загрузки авто на ' + action.payload);
            return {
                ...state,
                vehicle_loading: action.payload
            }
        case 'ON_CHANGE_LOGIN':
            console.log('Изменение логина на ' + action.payload);
            return {
                ...state,
                api:{
                    ...state.api,
                    login: action.payload
                }
            }
        case 'ON_CHANGE_PASSWORD':
            console.log('Изменение пароля на ' + action.payload);
            return {
                ...state,
                api:{
                    ...state.api,
                    password: action.payload
                }
            }
        case 'SET_AUTH_TOKEN':
            console.log('Изменение токена на ' + action.payload);
            return {
                ...state,
                api:{
                    ...state.api,
                    token: action.payload
                }
            }
        case 'SET_RESULT_TRANSPORTATIONS':
            console.log('Изменение выборки движения ТС');
            return {
                ...state,
                api:{
                    ...state.api,
                    result: action.payload
                }
            }
        case 'SET_COORDINATES':
            console.log('Изменение расстояния до точки А');
            return {
                ...state,
                data: {
                    ...state.data,
                    distance_a: action.payload1,
                    distance_b: action.payload2,
                    active_a: action.payload3,
                    active_b: action.payload4,
                }
            };
        case 'SET_COORDINATES_CLEAR_ACTIVATE':
            console.log('Сброс активаций по точкам');
            return {
                ...state,
                data: {
                    ...state.data,
                    active_a: false,
                    active_b: false,
                }
            };
        case 'SET_ARRIVAL_TO_POINT_A':
            console.log('Изменение времени прибытия в точку А ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    dt_arrival_a: action.payload
                }
            };
        case 'SET_TTN_NUMBER':
            console.log('Изменение номера ТТН ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    ttn_number: action.payload
                }
            };
        case 'SET_TTN_WEIGHT':
            console.log('Изменение веса ТТН ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    ttn_weight: action.payload
                }
            };
        case 'SET_LOADING_TO_POINT_A':
            console.log('Изменение времени фактической загрузки на точке А ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    dt_loading_a: action.payload
                }
            };
        case 'SET_DEPARTURE_TO_POINT_A':
            console.log('Изменение времени выезда с точки А ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    dt_departure_a: action.payload
                }
            };
        case 'SET_ARRIVAL_TO_POINT_B':
            console.log('Изменение времени прибытия в точку Б ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    dt_arrival_b: action.payload
                }
            };
        case 'SET_LOADING_TO_POINT_B':
            console.log('Изменение времени фактической загрузки на точке B ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    dt_loading_b: action.payload
                }
            };
        case 'SET_EMPTY_WEIGHT_POINT_A':
            console.log('Изменение пустого веса на точке А ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    empty_weight_a: action.payload
                }
            };
        case 'SET_EMPTY_WEIGHT_POINT_B':
            console.log('Изменение пустого веса на точке Б ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    empty_weight_b: action.payload
                }
            };
        case 'SET_FULL_WEIGHT_POINT_A':
            console.log('Изменение полного веса на точке А ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    full_weight_a: action.payload
                }
            };
        case 'SET_FULL_WEIGHT_POINT_B':
            console.log('Изменение полного веса на точке Б ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    full_weight_b: action.payload
                }
            };
        case 'SET_FINISH_POINT_A':
            console.log('Изменение видимости блока А ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    point_a_finish: action.payload
                }
            };
        case 'SET_FINISH_POINT_B':
            console.log('Изменение видимости блока B ' + action.payload);
            return {
                ...state,
                metric: {
                    ...state.metric,
                    point_b_finish: action.payload
                }
            };
        case 'SET_EMPTY_RESULT':
            console.log('Очиста отработанного заказа');
            return {
                ...state,
                api: {
                    ...state.api,
                    result: {}
                },
                metric: INITIAL_STATE.metric
                //data: INITIAL_STATE.data
            };
        default:
            return state;
    }
}
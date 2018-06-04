export default function (state={options: {}}, action) {
    switch (action.type) {
        case 'IS_AVALIABLE_API':
            alert('change IS_AVALIABLE_API' + action.payload);
            state.options.isAvaliableApi = action.payload;
            console.log(state);
            return action.payload;
            break;
        default:
            return state;
    }
}
export const updateType = (type) => {
    return {
        type: "IS_AVALIABLE_API",
        payload: type
    }
};

export const updateLoading = (type) => {
    return {
        type: "IS_LOADING",
        payload: type
    }
};

export const addVehicle = (type) => {
    return {
        type: "ADD_VEHICLE",
        payload: type
    }
};

export const updateVehicleLoadingStatus = (type) => {
    return {
        type: "IS_VEHICLE_LOADING",
        payload: type
    }
};

export const onChancgeLogin = (type) => {
    return {
        type: "ON_CHANGE_LOGIN",
        payload: type
    }
};

export const onChancgePassword = (type) => {
    return {
        type: "ON_CHANGE_PASSWORD",
        payload: type
    }
};

export const setAuthToken = (type) => {
    return {
        type: "SET_AUTH_TOKEN",
        payload: type
    }
};

export const setResultTransportations = (type) => {
    return {
        type: "SET_RESULT_TRANSPORTATIONS",
        payload: type
    }
};

export const setCoordinates = (type1, type2, type3, type4) => {
    return {
        type: "SET_COORDINATES",
        payload1: type1,
        payload2: type2,
        payload3: type3,
        payload4: type4,
    }
};
export const setCoordinatesDefault = () => {
    return {
        type: "SET_COORDINATES_CLEAR_ACTIVATE"
    }
};


// даты и время прибытия в точку А
export const setArrivalToPointA = (type) => {
    return {
        type: "SET_ARRIVAL_TO_POINT_A",
        payload: type
    }
};
// даты и время фактической загрузки в точке А
export const setLoadingToPointA = (type) => {
    return {
        type: "SET_LOADING_TO_POINT_A",
        payload: type
    }
};
// даты и время выезда из точки А
export const setDepartureToPointA = (type) => {
    return {
        type: "SET_DEPARTURE_TO_POINT_A",
        payload: type
    }
};

// даты и время прибытия в точку B
export const setArrivalToPointB = (type) => {
    return {
        type: "SET_ARRIVAL_TO_POINT_B",
        payload: type
    }
};
// даты и время фактической загрузки в точке B
export const setLoadingToPointB = (type) => {
    return {
        type: "SET_LOADING_TO_POINT_B",
        payload: type
    }
};

//веса  точка А
export const setEmptyWeightPointA = (type) => {
    return {
        type: "SET_EMPTY_WEIGHT_POINT_A",
        payload: type
    }
};

//веса  точка B
export const setEmptyWeightPointB = (type) => {
    return {
        type: "SET_EMPTY_WEIGHT_POINT_B",
        payload: type
    }
};

//веса  точка А
export const setFullWeightPointA = (type) => {
    return {
        type: "SET_FULL_WEIGHT_POINT_A",
        payload: type
    }
};

//веса  точка B
export const setFullWeightPointB = (type) => {
    return {
        type: "SET_FULL_WEIGHT_POINT_B",
        payload: type
    }
};

export const setFinishPointA = (type) => {
    return {
        type: "SET_FINISH_POINT_A",
        payload: type
    }
};

export const setFinishPointB = (type) => {
    return {
        type: "SET_FINISH_POINT_B",
        payload: type
    }
};

export const setTtnNumber = (type) => {
    return {
        type: "SET_TTN_NUMBER",
        payload: type
    }
};
export const setTtnWeight = (type) => {
    return {
        type: "SET_TTN_WEIGHT",
        payload: type
    }
};
export const setEmptyResult = (type) => {
    return {
        type: "SET_EMPTY_RESULT",
        payload: type
    }
};


import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {AsyncStorage, StyleSheet, Image, View, ActivityIndicator, ListView, Dimensions, ScrollView} from "react-native";
import {
    Container,
    Header,
    Text,
    Content,
    Spinner,
    Form,
    Button,
    Item,
    Label,
    CardItem,
    Card,
    Body,
    Root,
    Toast
} from "native-base";
import {MaskedInput} from "react-native-ui-lib";
import DatePicker from "react-native-datepicker";
import {connect} from "react-redux";
import {
    addVehicle,
    updateLoading,
    updateVehicleLoadingStatus,
    onChancgeLogin,
    onChancgePassword,
    setAuthToken,
    setResultTransportations,
    setCoordinates,
    setArrivalToPointA,
    setLoadingToPointA,
    setDepartureToPointA,
    setArrivalToPointB,
    setLoadingToPointB,
    setEmptyWeightPointA,
    setEmptyWeightPointB,
    setFullWeightPointA,
    setFullWeightPointB,
    setFinishPointA,
    setFinishPointB,
    setTtnNumber,
    setTtnWeight,
    setEmptyResult
} from "../actions/index";
import MapView, {Marker, Circle, ProviderPropType} from "react-native-maps";
import Moment from 'moment';

const GEO = require('geolib');
const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0302;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const POINT_A = {
    latitude: null,
    longitude: null,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
};
const POINT_B = {
    latitude: null,
    longitude: null,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
};
const POINT_A_ADDRESS = 'не указан';
const POINT_B_ADDRESS = 'не указан';

function styleForActive(point) {
    if (point) return [styles.text1];
    else return [styles.text2];
}
function setCardBackgroundColor(point) {
    if (point) return {backgroundColor: '#446283'};
    else return {backgroundColor: '#446283'};
}

class ListPoint extends Component {


    getTrueFuncRenderWeight(type_transportation, type_weight) {
        if (type_transportation == 'start') {
            // A point
            if (type_weight == 'empty')     return this.renderWeightEmptyPointA;
            else if (type_weight == 'full') return this.renderWeightFullPointA;
            else if (type_weight == 'ttn_number') return this.renderTtnNumber;
            else if (type_weight == 'ttn_weight') return this.renderTtnWeight;
            else return false
        }
        else if (type_transportation == 'finish') {
            //B Point
            if (type_weight == 'empty')     return this.renderWeightEmptyPointB;
            else if (type_weight == 'full') return this.renderWeightFullPointB;
            else return false
        }
    }

    sendDataToServer(type_transportation) {
        //var today = new Date('05 October 2011 14:48 UTC');
        //let timeDateA = new Moment(this.state.datetime1);
        // timeDateA = timeDateA.toISOString();
        /* let a = new Date("2018-03-15 10:26");
         this.setState({ddd: a});*/
        if (type_transportation == 'start') {
            if (this.props.options.metric.empty_weight_a &&
                this.props.options.metric.full_weight_a &&
                this.props.options.metric.ttn_number &&
                this.props.options.metric.ttn_weight) {

                let defWrite = false;
                if (this.props.options.metric.dt_loading_a == null) {
                    this.props.setLoadingToPointA(this.state.datetime1);
                    defWrite = true;
                    console.log(this.state);
                    console.log(this.props.options.metric);
                }



                let myHeaders = new Headers();

                myHeaders.set("Authorization", `Bearer ${this.props.options.api.token}`);
                myHeaders.set('Content-Type', 'multipart/form-data');
                let dt_a;
                if (!this.props.options.metric.dt_loading_a) {  dt_a = this.state.datetime1; }
                else  dt_a = this.props.options.metric.dt_loading_a;

                let timeDateA = new Moment(dt_a);
                timeDateA.subtract(3, 'hour');
                timeDateA = timeDateA.toISOString();

                let a = {
                    transportationId: this.props.options.api.result[0].transportationId,
                    start: {
                        dateLoading: timeDateA,
                        emptyWeight: this.props.options.metric.empty_weight_a,
                        fullWeight: this.props.options.metric.full_weight_a
                    },
                    ttn_number: this.props.options.metric.ttn_number,
                    ttn_weight: this.props.options.metric.ttn_weight
                };


                let formData = new FormData();
                formData.append("json", JSON.stringify(a));

                let myInit = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formData
                };

                console.log(myInit);

                //console.log(this.props);
                //return fetch('http://192.168.0.111:9001/index.php?function=Auth&login='+this.state.login+'&pwd='+this.state.password)

                fetch(this.props.options.api.server + this.props.options.api.version + '/tts/updateTtransportation', myInit)
                    .then((response) => response.json())
                    .then((responseJson2) => {
                        console.log(responseJson2);
                        if (responseJson2.type == 'error') {
                            Toast.show({
                                text: 'Ошибка. Данные не переданы.',
                                position: 'bottom',
                                type: 'danger',
                                buttonText: 'Ok',
                                duration: 7000
                            });
                        }
                        else {
                            this.props.setFinishPointA(true);
                        }

                    })
                    .catch((error) => {
                        console.error(error);
                    });

                if (!defWrite) {
                    Toast.show({
                        text: 'Данные записаны!',
                        position: 'bottom',
                        type: 'success'
                    });
                }
                else {
                    Toast.show({
                        text: 'Точное время не было указано, записано по умолчанию.',
                        position: 'bottom',
                        type: 'warning',
                        buttonText: 'Ok',
                        duration: 7000
                    });
                }

            } else {
                if (!this.props.options.metric.ttn_number) {
                    Toast.show({
                        text: 'Не указан номер ТТН',
                        position: 'bottom',
                        type: 'danger',
                        buttonText: 'Ok',
                        duration: 7000
                    });
                }
                if (!this.props.options.metric.ttn_weight) {
                    Toast.show({
                        text: 'Вес по ТТН не указан',
                        position: 'bottom',
                        type: 'danger',
                        buttonText: 'Ok',
                        duration: 7000
                    });
                }
                if (!this.props.options.metric.empty_weight_a) {
                    Toast.show({
                        text: 'Пустой вес не указан',
                        position: 'bottom',
                        type: 'danger',
                        buttonText: 'Ok',
                        duration: 7000
                    });
                }
                if (!this.props.options.metric.full_weight_a) {
                    Toast.show({
                        text: 'Полный вес не указан',
                        position: 'bottom',
                        type: 'danger',
                        buttonText: 'Ok',
                        duration: 7000
                    });
                }
            }
        }
        if (type_transportation == 'finish') {
            if ((this.props.options.metric.empty_weight_b) &&
                (this.props.options.metric.full_weight_b)) {

                let defWrite = false;
                if (this.props.options.metric.dt_loading_b == null) {
                    this.props.setLoadingToPointB(this.state.datetime2);
                    defWrite = true;
                    console.log(this.state);
                    console.log(this.props.options.metric);
                }



                let myHeaders = new Headers();

                myHeaders.set("Authorization", `Bearer ${this.props.options.api.token}`);
                myHeaders.set('Content-Type', 'multipart/form-data');
                let dt_b;
                if (!this.props.options.metric.dt_loading_b) {  dt_b = this.state.datetime2; }
                else  dt_b = this.props.options.metric.dt_loading_b;

                let timeDateB = new Moment(dt_b);
                timeDateB.subtract(3, 'hour');
                timeDateB = timeDateB.toISOString();

                let b = {
                    transportationId: this.props.options.api.result[0].transportationId,
                    end: {
                        dateLoading: timeDateB,
                        emptyWeight: this.props.options.metric.empty_weight_b,
                        fullWeight: this.props.options.metric.full_weight_b
                    }
                };


                let formData = new FormData();
                formData.append("json", JSON.stringify(b));

                let myInit = {
                    method: 'POST',
                    headers: myHeaders,
                    body: formData
                };

                console.log(myInit);

                //console.log(this.props);
                //return fetch('http://192.168.0.111:9001/index.php?function=Auth&login='+this.state.login+'&pwd='+this.state.password)

                fetch(this.props.options.api.server + this.props.options.api.version + '/tts/updateTtransportation', myInit)
                    .then((response) => response.json())
                    .then((responseJson2) => {
                        console.log(responseJson2);
                        if (responseJson2.type == 'error') {
                            Toast.show({
                                text: 'Ошибка. Данные не переданы.',
                                position: 'bottom',
                                type: 'danger',
                                buttonText: 'Ok',
                                duration: 7000
                            });
                        }
                        else {
                            this.props.setFinishPointB(true);
                            setTimeout(()=>{this.props.setEmptyResult(); console.log(this.props.options);}, 3000);
                        }

                    })
                    .catch((error) => {
                        console.error(error);
                    });

                if (!defWrite) {
                    Toast.show({
                        text: 'Данные записаны!',
                        position: 'bottom',
                        type: 'success'
                    });
                }
                else {
                    Toast.show({
                        text: 'Точное время не было указано, записано по умолчанию.',
                        position: 'bottom',
                        type: 'warning',
                        buttonText: 'Ok',
                        duration: 7000
                    });
                }

            } else {
                if (!this.props.options.metric.empty_weight_b) {
                    Toast.show({
                        text: 'Пустой вес не указан',
                        position: 'bottom',
                        type: 'danger',
                        buttonText: 'Ok',
                        duration: 7000
                    });
                }
                if (!this.props.options.metric.full_weight_b) {
                    Toast.show({
                        text: 'Полный вес не указан',
                        position: 'bottom',
                        type: 'danger',
                        buttonText: 'Ok',
                        duration: 7000
                    });
                }
            }
        }



        console.log(type_transportation);
        // console.log(timeDateA); // вернёт 2011-10-05T14:48:00.000Z

    }

    getMaskedInput(type){
        if(type == 'start'){
            return(
                <View>
                    <MaskedInput
                        renderMaskedText={this.getTrueFuncRenderWeight(type, 'ttn_number')}
                        onChangeText={(text) => {
                            if (type == 'start') this.props.setTtnNumber(text);
                        }}
                        caretHidden
                        keyboardType={'numeric'}
                        maxLength={10}/>
                    <MaskedInput
                        renderMaskedText={this.getTrueFuncRenderWeight(type, 'ttn_weight')}
                        onChangeText={(text) => {
                            if (type == 'start') this.props.setTtnWeight(text);
                        }}
                        caretHidden
                        keyboardType={'numeric'}
                        maxLength={5}/>
                    <MaskedInput
                        renderMaskedText={this.getTrueFuncRenderWeight(type, 'empty')}
                        onChangeText={(text) => {
                            if (type == 'start') this.props.setEmptyWeightPointA(text);
                            if (type == 'finish') this.props.setEmptyWeightPointB(text);
                        }}
                        caretHidden
                        keyboardType={'numeric'}
                        maxLength={5}/>
                    <MaskedInput
                        renderMaskedText={this.getTrueFuncRenderWeight(type, 'full')}
                        onChangeText={(text) => {
                            if (type == 'start') this.props.setFullWeightPointA(text);
                            if (type == 'finish') this.props.setFullWeightPointB(text);
                        }}
                        caretHidden
                        keyboardType={'numeric'}
                        maxLength={5}/>
                </View>
            );
        }
        else if (type == 'finish'){
            return(
                <View>
                    <MaskedInput
                        renderMaskedText={this.getTrueFuncRenderWeight(type, 'empty')}
                        onChangeText={(text) => {
                            if (type == 'start') this.props.setEmptyWeightPointA(text);
                            if (type == 'finish') this.props.setEmptyWeightPointB(text);
                        }}
                        caretHidden
                        keyboardType={'numeric'}
                        maxLength={5}/>
                    <MaskedInput
                        renderMaskedText={this.getTrueFuncRenderWeight(type, 'full')}
                        onChangeText={(text) => {
                            if (type == 'start') this.props.setFullWeightPointA(text);
                            if (type == 'finish') this.props.setFullWeightPointB(text);
                        }}
                        caretHidden
                        keyboardType={'numeric'}
                        maxLength={5}/>
                </View>
            );
        }
    }

    getMapOrInput(point, region, provider, type) {
        if (point) {
            return (
                <Root>
                    <Text style={{fontSize: 30, color: '#a4e391'}}> Вы прибыли в пункт назначения.</Text>
                    <DatePicker
                        style={{width: 400}}
                        date={this.state.datetime1}
                        mode="datetime"
                        format="YYYY-MM-DD HH:mm"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        iconSource={require('../src/calendar.png')}
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            },
                            placeholderText: {fontSize: 20, color: '#FFF'},
                            dateText: {fontSize: 20, color: '#FFF'}
                        }}
                        minuteInterval={10}
                        onDateChange={(datetime) => {
                            switch (type) {
                                case 'start':
                                    this.setState({datetime1: datetime});
                                    console.log(this.state);
                                    this.props.setLoadingToPointA(datetime);
                                    break;
                                case 'finish':
                                    this.setState({datetime2: datetime});
                                    this.props.setLoadingToPointB(datetime);
                                    break;
                            }

                        }}/>


                    {this.getMaskedInput(type)}
                    <Button full
                            style={{
                                backgroundColor: '#4c6e93', height: 120, marginTop: 30, paddingTop: 20,
                                borderColor: '#3a5471',
                                borderStyle: 'solid',
                                borderRadius: 0,
                                borderRightWidth: 2,
                                borderBottomWidth: 2,
                                borderWidth: 0
                            }}
                            onPress={ () => {
                                this.sendDataToServer(type)
                            } }
                    >
                        <Text>Сохранить данные</Text>
                    </Button>
                </Root>
            );
        }
        else return (
            <MapView
                provider={provider}
                customMapStyle={customStyle}
                style={styles.map}
                scrollEnabled={true}
                zoomEnabled={true}
                pitchEnabled={true}
                rotateEnabled={false}
                mapType="standard"

                liteMode={true}
                showsMyLocationButton={true}
                showsPointsOfInterest={false}
                showsCompass={true}
                showsBuildings={true}
                userLocationAnnotationTitle=""
                showsTraffic={false}
                showsIndoors={true}

                zoomControlEnabled={true}
                toolbarEnabled={true}
                loadingEnabled={true}
                showsUserLocation={ true }

                initialRegion={ region}>
                <Circle center={region}
                        radius={1000}
                        fillColor="rgba(103,191,77,0.2)"
                        strokeColor="rgba(103,191,77,1)"
                />
                <Marker coordinate={ region}/>
            </MapView>
        );
    }

    constructor(props) {
        super(props);
        if (!Date.prototype.toISOString) {
            (function () {

                function pad(number) {
                    if (number < 10) {
                        return '0' + number;
                    }
                    return number;
                }

                Date.prototype.toISOString = function () {
                    return this.getUTCFullYear() +
                        '-' + pad(this.getUTCMonth() + 1) +
                        '-' + pad(this.getUTCDate()) +
                        'T' + pad(this.getUTCHours()) +
                        ':' + pad(this.getUTCMinutes()) +
                        ':' + pad(this.getUTCSeconds()) +
                        '.' + (this.getUTCMilliseconds() / 1000).toFixed(3).slice(2, 5) +
                        'Z';
                };

            }());
        }
        Date.prototype.toLocaleFormat = function (format) {
            var f = {
                y: this.getYear() + 1900,
                m: this.getMonth() + 1,
                d: this.getDate(),
                H: this.getHours() + 3,
                M: this.getMinutes(),
                S: this.getSeconds()
            }
            for (k in f)
                format = format.replace('%' + k, f[k] < 10 ? "0" + f[k] : f[k]);
            return format;
        };
        let dateAll = new Date().toLocaleFormat('%y-%m-%d %H:%M');
        let dateObj = new Date().toLocaleFormat('%y-%m-%d');
        let timeObj = new Date().toLocaleFormat('%H:%M');
        //console.log(dateObj);
        this.state = {
            date: dateObj,
            time: timeObj,
            datetime: dateAll,
            datetime1: dateAll,
            datetime2: dateAll,
            latitude: null,
            longitude: null,
            error: null,
            showToast: false,
            paddedValue1: 0,
            paddedValue2: 0,
        };
    }

    renderWeightEmptyPointA = (value) => {
        const paddedValue1 = _.padStart(value, 1, '0');
        const primary1 = paddedValue1.substr(0, 2);
        const second1 = paddedValue1.substr(2, 3);
        return (
            <View style={{
                marginTop: 15,
                height: 100,
                opacity: 0.8,
                backgroundColor: '#4c6e93',
                margin: 6,
                borderColor: '#3a5471',
                borderStyle: 'solid',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
            }}>
                <Text style={{fontSize: 20, color: '#FFF'}}>
                    Пустой вес: {primary1}
                    <Text> </Text>
                    {second1}
                    <Text style={{fontSize: 20, color: '#FFF'}}> кг.</Text>
                </Text>
            </View>
        );
    }
    renderWeightFullPointA = (value) => {
        const paddedValue2 = _.padStart(value, 1, '0');
        const primary2 = paddedValue2.substr(0, 2);
        const second2 = paddedValue2.substr(2, 3);

        return (
            <View style={{
                marginTop: 15,
                height: 100,
                opacity: 0.8,
                backgroundColor: '#4c6e93',
                margin: 6,
                borderColor: '#3a5471',
                borderStyle: 'solid',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5
            }}>
                <Text style={{fontSize: 20, color: '#FFF'}}>
                    Полный вес: {primary2}
                    <Text> </Text>
                    {second2}
                    <Text style={{fontSize: 20, color: '#FFF'}}> кг.</Text>
                </Text>
            </View>
        );
    }
    renderWeightEmptyPointB = (value) => {
        const paddedValue3 = _.padStart(value, 1, '0');
        const primary3 = paddedValue3.substr(0, 2);
        const second3 = paddedValue3.substr(2, 3);
        return (
            <View style={{
                marginTop: 15,
                height: 100,
                opacity: 0.8,
                backgroundColor: '#4c6e93',
                margin: 6,
                borderColor: '#3a5471',
                borderStyle: 'solid',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5,
            }}>
                <Text style={{fontSize: 20, color: '#FFF'}}>
                    Пустой вес: {primary3}
                    <Text> </Text>
                    {second3}
                    <Text style={{fontSize: 20, color: '#FFF'}}> кг.</Text>
                </Text>
            </View>
        );
    }
    renderWeightFullPointB = (value) => {
        const paddedValue4 = _.padStart(value, 1, '0');
        const primary4 = paddedValue4.substr(0, 2);
        const second4 = paddedValue4.substr(2, 3);


        return (
            <View style={{
                marginTop: 15,
                height: 100,
                opacity: 0.8,
                backgroundColor: '#4c6e93',
                margin: 6,
                borderColor: '#3a5471',
                borderStyle: 'solid',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5
            }}>
                <Text style={{fontSize: 20, color: '#FFF'}}>
                    Полный вес: {primary4}
                    <Text> </Text>
                    {second4}
                    <Text style={{fontSize: 20, color: '#FFF'}}> кг.</Text>
                </Text>
            </View>
        );
    }
    renderTtnWeight = (value) => {
        const paddedValue5 = _.padStart(value, 1, '0');
        const primary5 = paddedValue5.substr(0, 2);
        const second5 = paddedValue5.substr(2, 3);

        return (
            <View style={{
                marginTop: 15,
                height: 100,
                opacity: 0.8,
                backgroundColor: '#4c6e93',
                margin: 6,
                borderColor: '#3a5471',
                borderStyle: 'solid',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5
            }}>
                <Text style={{fontSize: 20, color: '#FFF'}}>
                    Вес по ТТН: {primary5}
                    <Text> </Text>
                    {second5}
                    <Text style={{fontSize: 20, color: '#FFF'}}> кг.</Text>
                </Text>
            </View>
        );
    }
    renderTtnNumber = (value) => {
        const paddedValue6 = _.padStart(value, 1, '0');
        const primary6 = paddedValue6.substr(0, 2);
        const second6 = paddedValue6.substr(2, 3);

        return (
            <View style={{
                marginTop: 15,
                height: 100,
                opacity: 0.8,
                backgroundColor: '#4c6e93',
                margin: 6,
                borderColor: '#3a5471',
                borderStyle: 'solid',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 5
            }}>
                <Text style={{fontSize: 20, color: '#FFF'}}>
                    ТТН номер: {primary6}
                    {second6}
                </Text>
            </View>
        );
    }

    getViewA(){
        if (this.props.options.metric.point_a_finish == false) {
            return (
                <View>
                    <Card style={{
                        backgroundColor: '#4c6e93', borderColor: '#3a5471',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 10
                    }}>
                        <CardItem header style={setCardBackgroundColor(this.props.options.data.active_a)}>
                            <Text style={{color: '#FFF', fontSize: 20}}>Пункт А. (Загрузка) </Text>
                        </CardItem>
                        <CardItem style={setCardBackgroundColor(this.props.options.data.active_a)}>
                            <Body style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text
                                style={styleForActive(this.props.options.data.active_a)}>{this.props.options.api.result[0].startPoint.name} </Text>
                            <Text style={{color: '#FFF'}}>Пункт загрузки
                                через: {this.props.options.data.distance_a} км.</Text>
                            <Text
                                style={{color: '#FFF'}}>{this.POINT_A_ADDRESS} </Text>
                            {this.getMapOrInput(this.props.options.data.active_a, this.REGION_A, this.props.provider, 'start')}
                            </Body>
                        </CardItem>
                        <CardItem footer style={setCardBackgroundColor(this.props.options.data.active_a)}>
                            <Text style={{color: '#FFF', fontSize: 12}}>Для активации ввода необходимо
                                быть в радиусе {this.props.options.data.radius_activate / 1000}
                                км.</Text>
                        </CardItem>
                    </Card>
                </View>
            );
        }
        else {
            return (
                <View>
                    <Card style={{
                        backgroundColor: '#4c6e93', borderColor: '#3a5471',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 10
                    }}>
                        <CardItem header style={{backgroundColor: '#018706'}}>
                            <Text style={{color: '#FFF', fontSize: 20}}>Вы успешно загрузились.</Text>
                        </CardItem>
                    </Card>
                </View>
            );
        }

    }
    getViewB(){
        if (this.props.options.metric.point_b_finish == false) {
            return (
                <View>
                    <Card style={{
                        backgroundColor: '#4c6e93', borderColor: '#3a5471',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 10
                    }}>
                        <CardItem header style={setCardBackgroundColor(this.props.options.data.active_b)}>
                            <Text style={{color: '#FFF', fontSize: 20}}>Пункт Б. (Разгрузка) </Text>
                        </CardItem>
                        <CardItem style={setCardBackgroundColor(this.props.options.data.active_b)}>
                            <Body style={{alignItems: 'center', justifyContent: 'center'}}>
                            <Text
                                style={styleForActive(this.props.options.data.active_b)}>{this.props.options.api.result[0].endPoint.name} </Text>
                            <Text style={{color: '#FFF'}}>Пункт разгрузки
                                через: {this.props.options.data.distance_b} км.</Text>
                            <Text
                                style={{color: '#FFF'}}>{this.POINT_B_ADDRESS} </Text>

                            {this.getMapOrInput(this.props.options.data.active_b, this.REGION_B, this.props.provider, 'finish')}


                            </Body>
                        </CardItem>
                        <CardItem footer style={setCardBackgroundColor(this.props.options.data.active_b)}>
                            <Text style={{color: '#FFF', fontSize: 12}}>Для активации ввода необходимо
                                быть в радиусе {this.props.options.data.radius_activate / 1000}
                                км.</Text>
                        </CardItem>
                    </Card>
                </View>
            );
        }
        else {
            return (
                <View>
                    <Card style={{
                        backgroundColor: '#4c6e93', borderColor: '#3a5471',
                        borderStyle: 'solid',
                        borderWidth: 2,
                        borderRadius: 10
                    }}>
                        <CardItem header style={{backgroundColor: '#018706'}}>
                            <Text style={{color: '#FFF', fontSize: 20}}>Вы успешно разгрузились.</Text>
                        </CardItem>
                    </Card>
                </View>
            );
        }

    }

    async componentWillMount() {
        var coord_a = this.props.options.api.result[0].startPoint.address.split(':');
        if (coord_a[2]) this.POINT_A_ADDRESS = coord_a[2];
        var coord_b = this.props.options.api.result[0].endPoint.address.split(':');
        if (coord_b[2]) this.POINT_B_ADDRESS = coord_b[2];

        this.REGION_A = {
            latitude: parseFloat(coord_a[0]),
            longitude: parseFloat(coord_a[1]),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };

        this.REGION_B = {
            latitude: parseFloat(coord_b[0]),
            longitude: parseFloat(coord_b[1]),
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
        setInterval(() => {
            //console.log(this.state.datetime.toISOString);
            navigator.geolocation.getCurrentPosition(
                (position) => {

                    //дистанция
                    var distToA = GEO.getDistance({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }, {
                        latitude: coord_a[0],
                        longitude: coord_a[1]
                    });

                    var distToB = GEO.getDistance({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }, {
                        latitude: coord_b[0],
                        longitude: coord_b[1]
                    });

                    //Показывает дистанцию в километрах
                    var radius_a = GEO.isPointInCircle(
                        {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }, {
                            latitude: coord_a[0],
                            longitude: coord_a[1]
                        },
                        this.props.options.data.radius_activate
                    );



                    var radius_b = GEO.isPointInCircle(
                        {
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude
                        }, {
                            latitude: coord_b[0],
                            longitude: coord_b[1]
                        },
                        this.props.options.data.radius_activate
                    );

                    // проставляем дату въезда на точку загрузки
                    if(radius_a == true && this.props.options.metric.dt_arrival_a == null) {
                        this.props.setArrivalToPointA(new Date());
                        console.log(this.props.options.metric);

                        let myHeaders = new Headers();

                        myHeaders.set("Authorization", `Bearer ${this.props.options.api.token}`);
                        myHeaders.set('Content-Type', 'multipart/form-data');

                        let a = {
                            transportationId: this.props.options.api.result[0].transportationId,
                            start: {
                                arrivalDate: this.props.options.metric.dt_arrival_a
                            }
                        };

                        let formData = new FormData();
                        formData.append("json", JSON.stringify(a));
                        let myInit = {
                            method: 'POST',
                            headers: myHeaders,
                            body: formData
                        };
                        // console.log(myInit);
                        fetch(this.props.options.api.server + this.props.options.api.version + '/tts/updateTtransportation', myInit)
                            .then((response) => response.json())
                            .then((responseJson2) => {
                                console.log(responseJson2);
                                if (responseJson2.type == 'error') {
                                    Toast.show({
                                        text: 'Ошибка. Данные не переданы.',
                                        position: 'bottom',
                                        type: 'danger',
                                        buttonText: 'Ok',
                                        duration: 7000
                                    });
                                }
                                else {
                                    Toast.show({
                                        text: 'Время прибытия на точку загрузки записано!',
                                        position: 'bottom',
                                        type: 'success',
                                        buttonText: 'Ok',
                                        duration: 7000
                                    });
                                }

                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                    // проставляем дату выезда с точки загрузки
                    if(radius_a == false && this.props.options.metric.dt_arrival_a != null && this.props.options.metric.dt_departure_a == null) {
                        this.props.setDepartureToPointA(new Date());
                        console.log(this.props.options.metric);

                        let myHeaders = new Headers();

                        myHeaders.set("Authorization", `Bearer ${this.props.options.api.token}`);
                        myHeaders.set('Content-Type', 'multipart/form-data');

                        let a = {
                            transportationId: this.props.options.api.result[0].transportationId,
                            start: {
                                departureDate: this.props.options.metric.dt_departure_a
                            }
                        };

                        let formData = new FormData();
                        formData.append("json", JSON.stringify(a));
                        let myInit = {
                            method: 'POST',
                            headers: myHeaders,
                            body: formData
                        };
                        // console.log(myInit);
                        fetch(this.props.options.api.server + this.props.options.api.version + '/tts/updateTtransportation', myInit)
                            .then((response) => response.json())
                            .then((responseJson2) => {
                                console.log(responseJson2);
                                if (responseJson2.type == 'error') {
                                    Toast.show({
                                        text: 'Ошибка. Данные не переданы.',
                                        position: 'bottom',
                                        type: 'danger',
                                        buttonText: 'Ok',
                                        duration: 7000
                                    });
                                }
                                else {
                                    Toast.show({
                                        text: 'Время выезда с точки загрузки записано!',
                                        position: 'bottom',
                                        type: 'success',
                                        buttonText: 'Ok',
                                        duration: 7000
                                    });
                                }

                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                    // проставляем дату въезда на точку разгрузки
                    if(radius_b == true && this.props.options.metric.dt_arrival_b == null) {
                        this.props.setArrivalToPointB(new Date());
                        console.log(this.props.options.metric);

                        let myHeaders = new Headers();

                        myHeaders.set("Authorization", `Bearer ${this.props.options.api.token}`);
                        myHeaders.set('Content-Type', 'multipart/form-data');

                        let a = {
                            transportationId: this.props.options.api.result[0].transportationId,
                            end: {
                                arrivalDate: this.props.options.metric.dt_arrival_b
                            }
                        };

                        let formData = new FormData();
                        formData.append("json", JSON.stringify(a));
                        let myInit = {
                            method: 'POST',
                            headers: myHeaders,
                            body: formData
                        };
                        // console.log(myInit);
                        fetch(this.props.options.api.server + this.props.options.api.version + '/tts/updateTtransportation', myInit)
                            .then((response) => response.json())
                            .then((responseJson2) => {
                                console.log(responseJson2);
                                if (responseJson2.type == 'error') {
                                    Toast.show({
                                        text: 'Ошибка. Данные не переданы.',
                                        position: 'bottom',
                                        type: 'danger',
                                        buttonText: 'Ok',
                                        duration: 7000
                                    });
                                }
                                else {
                                    Toast.show({
                                        text: 'Время прибытия на точку разгрузки записано!',
                                        position: 'bottom',
                                        type: 'success',
                                        buttonText: 'Ok',
                                        duration: 7000
                                    });
                                }

                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }

                    this.props.setCoordinates(
                        parseFloat(distToA / 1000).toFixed(1),
                        parseFloat(distToB / 1000).toFixed(1),
                        radius_a,
                        radius_b
                    );

                    //console.log(this.props);

                },
                (error) => console.log(error),
                {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
            );

        }, 2000);
    }

    render() {
        if (this.props.options.data.active_a != null && this.props.options.data.active_b != null) {
            if (this.props.options.api.result.length > 0) {
                return (
                    <Root>
                        <Container style={{backgroundColor: '#4c6e93'}}>
                            <Header style={{backgroundColor: '#FFF'}}/>
                            <Content>
                                { this.getViewA() }
                                { this.getViewB() }
                            </Content>
                        </Container>
                    </Root>
                );
            }
            else {
                return (
                    <Container style={{backgroundColor: '#4c6e93'}}>
                        <Header style={{backgroundColor: '#000'}}/>
                        <Content style={{paddingTop: 200, alignSelf: 'center'}}>
                            <Text style={{color: '#FFF'}}>Заявок нет</Text>
                        </Content>
                    </Container>
                );
            }
        }
        else {
            return (
                <Container style={{backgroundColor: '#4c6e93'}}>
                    <Header style={{backgroundColor: '#000'}}/>
                    <Content style={{paddingTop: 200, alignSelf: 'center'}}>
                        <Text style={{color: '#FFF'}}>Идет загрузка координат . . .</Text>
                        <Spinner color='#FFF'/>
                    </Content>
                </Container>
            );
        }
    }
}

ListPoint.propTypes = {
    provider: ProviderPropType,
};

const styles = StyleSheet.create({
    text1: {
        fontSize: 16,
        color: '#FFF',
    },
    text2: {
        fontSize: 26,
        color: '#FFF',
    },
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    scrollview: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    map: {
        width: 550,
        height: 200,
        alignItems: 'center',
    },
});

const customStyle = [
    {
        elementType: 'geometry',
        stylers: [
            {
                color: '#446283',
            },
        ],
    },
    {
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#FFFFFF',
            },
        ],
    },
    {
        elementType: 'labels.text.stroke',
        stylers: [
            {
                color: '#242f3e',
            },
        ],
    },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#FFFFFF',
            },
        ],
    },
    {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#FFFFFF',
            },
        ],
    },
    {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [
            {
                color: '#4c6e93',
            },
        ],
    },
    {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#ffffff',
            },
        ],
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [
            {
                color: '#666666',
            },
        ],
    },
    {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#666666',
            },
        ],
    },
    {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#ffffff',
            },
        ],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [
            {
                color: '#666666',
            },
        ],
    },
    {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [
            {
                color: '#666666',
            },
        ],
    },
    {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#ffffff',
            },
        ],
    },
    {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [
            {
                color: '#446283',
            },
        ],
    },
    {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#FFFFFF',
            },
        ],
    },
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [
            {
                color: '#17263c',
            },
        ],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [
            {
                color: '#515c6d',
            },
        ],
    },
    {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [
            {
                color: '#17263c',
            },
        ],
    },
];

function mapStateToProps(state) {
    return {
        options: state.options
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        addVehicle,
        updateLoading,
        updateVehicleLoadingStatus,
        onChancgeLogin,
        onChancgePassword,
        setAuthToken,
        setResultTransportations,
        setCoordinates,
        setArrivalToPointA,
        setLoadingToPointA,
        setDepartureToPointA,
        setArrivalToPointB,
        setLoadingToPointB,
        setEmptyWeightPointA,
        setEmptyWeightPointB,
        setFullWeightPointA,
        setFullWeightPointB,
        setFinishPointA,
        setFinishPointB,
        setTtnNumber,
        setTtnWeight,
        setEmptyResult
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(ListPoint);


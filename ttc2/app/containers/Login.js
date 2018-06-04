import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {AsyncStorage, StyleSheet, Image, ActivityIndicator, ListView} from "react-native";
import {Container, Header, Text, Button, Content, Spinner, Form, Item, Input, Label} from "native-base";
import {Dropdown} from "react-native-material-dropdown";
import {connect} from "react-redux";
import {
    addVehicle,
    updateLoading,
    updateVehicleLoadingStatus,
    onChancgeLogin,
    onChancgePassword,
    setAuthToken,
    setResultTransportations,
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
    setTtnWeight
} from "../actions/index";
import ListPoint from './ListPoint';
import { KeepAwake } from 'expo';
let KJUR = require('jsrsasign');


function generateToken(data, sharedSecret) {
    var oHeader = {alg: 'HS256', typ: 'JWT'};
    return ( KJUR.jws.JWS.sign("HS256", oHeader, data, sharedSecret));
}

class Login extends Component {

    async componentWillMount() {
        if (this.props.options.vehicle_loading == true) {
            try {

                await fetch(this.props.options.api.server + this.props.options.api.version + '/tts/getTodayCars')
                    .then((response) => response.json())
                    .then((responseJson) => {
                       // console.log(responseJson);
                        let dataSource = [];
                        responseJson.result.forEach(function (entry) {
                            //console.log(entry.gosNumber);
                            dataSource.push({'value': entry.gosNumber});
                        });
                        this.props.addVehicle(dataSource);
                        this.props.updateVehicleLoadingStatus(false);
                    });

            } catch (err) {
                console.log(err);
                this.props.updateVehicleLoadingStatus(false);
            }
        }



           let timerId = setInterval(() => {
                if (this.props.options.api.token != '')  {clearTimeout(timerId); return;}

                fetch(this.props.options.api.server + this.props.options.api.version + '/tts/getTodayCars')
                    .then((response) => response.json())
                    .then((responseJson) => {
                        let dataSource = [];
                        responseJson.result.forEach(function (entry) {
                            dataSource.push({'value': entry.gosNumber});
                        });
                        this.props.addVehicle(dataSource);
                    });
            }, 2000);




    }

    onLoginPress = () => {
        let myHeaders = new Headers();
        let token = generateToken({
            gosNumber: this.props.options.api.login,
            authCode: this.props.options.api.password
        },this.props.options.api.secret);

        myHeaders.set("Authorization", `Bearer ${token}`);

        let myInit = {
            method: 'POST',
            headers: myHeaders,
            mode: 'cors',
            cache: 'default'
        };

        //console.log(this.props);
        //return fetch('http://192.168.0.111:9001/index.php?function=Auth&login='+this.state.login+'&pwd='+this.state.password)

        fetch(this.props.options.api.server + this.props.options.api.version + '/tts/getTransportations', myInit)
            .then((response) => response.json())
            .then((responseJson2) => {
                console.log(responseJson2);

                if (responseJson2['result']) {
                    this.props.setResultTransportations(responseJson2['result']);
                    if (responseJson2['result'][0].startPoint.dates.arrivalDate != null) this.props.setArrivalToPointA(responseJson2['result'][0].startPoint.dates.arrivalDate);
                    if (responseJson2['result'][0].startPoint.dates.dateLoading != null) this.props.setLoadingToPointA(responseJson2['result'][0].startPoint.dates.dateLoading);
                    if (responseJson2['result'][0].startPoint.dates.departureDate != null) this.props.setDepartureToPointA(responseJson2['result'][0].startPoint.dates.departureDate);
                    if (responseJson2['result'][0].startPoint.weights.emptyWeight != null) this.props.setEmptyWeightPointA(responseJson2['result'][0].startPoint.weights.emptyWeight);
                    if (responseJson2['result'][0].startPoint.weights.fullWeight != null) this.props.setFullWeightPointA(responseJson2['result'][0].startPoint.weights.fullWeight);

                    if (responseJson2['result'][0].startPoint.dates.departureDate != null) this.props.setFinishPointA(true);

                    if (responseJson2['result'][0].ttn_number != null)  this.props.setTtnNumber(responseJson2['result'][0].ttn_number);
                    if (responseJson2['result'][0].ttn_weight != null)  this.props.setTtnWeight(responseJson2['result'][0].ttn_weight);

                    if (responseJson2['result'][0].endPoint.dates.arrivalDate != null) this.props.setArrivalToPointB(responseJson2['result'][0].endPoint.dates.arrivalDate);
                    if (responseJson2['result'][0].endPoint.dates.dateLoading != null) this.props.setLoadingToPointB(responseJson2['result'][0].endPoint.dates.dateLoading);
                    if (responseJson2['result'][0].endPoint.dates.departureDate != null) this.props.setDepartureToPointB(responseJson2['result'][0].endPoint.dates.departureDate);
                    if (responseJson2['result'][0].endPoint.weights.emptyWeight != null) this.props.setEmptyWeightPointB(responseJson2['result'][0].endPoint.weights.emptyWeight);
                    if (responseJson2['result'][0].endPoint.weights.fullWeight != null) this.props.setFullWeightPointB(responseJson2['result'][0].endPoint.weights.fullWeight);

                    if (responseJson2['result'][0].endPoint.dates.dateLoading != null) this.props.setFinishPointB(true);

                    console.log(this.props.options.metric);
                    //AsyncStorage.setItem('token', JSON.stringify(responseJson2['token']), () => {
                    AsyncStorage.setItem('token', token, () => {
                        AsyncStorage.getItem('token', (err, result) => {
                            this.props.setAuthToken(result);
                            //console.log(this.props);
/*
                            if (this.props.navigation) this.props.navigation.navigate('Home');
                            else this.props.onLoginPress();*/
                        });
                    });
                }
                else if (responseJson2['statusCode'] && responseJson2['statusCode'] == 401) {
                    alert(responseJson2['error'] + '! ' + responseJson2['message']);
                }
                else {
                    alert('Неправильно указан логин или пароль');
                }
            })
            .catch((error) => {
                console.error(error);
            });


    };

    render() {
        if (!this.props.options.api.token) {
            if (this.props.options.vehicle_loading) {
                //console.log(this.props.options);
                return (
                    <Container style={{backgroundColor: '#4c6e93'}}>
                        <Header style={{backgroundColor: '#000'}}/>
                        <Content style={{paddingTop: 200, alignSelf: 'center'}}>
                            <Text style={{color: '#FFF'}}>Загружаю автомашины . . . </Text>
                            <Spinner color='#FFF'/>
                        </Content>
                        <KeepAwake />
                    </Container>
                );
            }
            else {
                return (
                    <Container style={{backgroundColor: '#446283'}}>
                        <Header style={{backgroundColor: '#000'}}/>
                        <Content style={{paddingTop: 50, alignSelf: 'center'}}>
                            <Image
                                source={require('../src/logo.png')}
                                style={[styles.logo]}/>
                            <Form style={{alignContent: 'center'}}>
                                <Dropdown
                                    label='Выберите автомобиль'
                                    fontSize={22}
                                    labelFontSize={16}
                                    baseColor="#FFF"
                                    textColor="#FFF"
                                    itemColor="#000"
                                    itemTextStyle={{backgroundColor:'#4c6e93'}}
                                    overlayStyle={{backgroundColor:'#4c6e93', opacity: 0.8}}
                                    pickerStyle={{backgroundColor:'#4c6e93'}}
                                    containerStyle={{padding: 0,
                                        paddingLeft:15,
                                        paddingRight:15,
                                        borderColor: '#3a5471',
                                        borderStyle: 'solid',
                                        borderRightWidth  : 1,
                                        borderBottomLeftRadius: 0,
                                        borderBottomRightRadius: 0,
                                        borderBottomWidth  : 1}}
                                    data={this.props.options.vehicle}
                                    onChangeText={(text) => {

                                        this.props.onChancgeLogin(text);
                                        // console.log(this.props);
                                    }}
                                />
                                <Item style={{paddingTop: 20,justifyContent: 'center',alignItems: 'center',alignContent: 'center',borderColor: '#3a5471',
                                    borderStyle: 'solid',
                                    borderRightWidth  : 1,
                                    borderBottomLeftRadius: 0,
                                    borderBottomRightRadius: 0,
                                    borderBottomWidth  : 1,}} floatingLabel last>
                                    <Label style={{fontSize: 22, justifyContent: 'center',color: '#fff'}}>Код авторизации</Label>
                                    <Input style={{justifyContent: 'center',color: '#fff'}} onChangeText={(text) => {
                                        this.props.onChancgePassword(text);
                                    }}/>
                                </Item>
                                <Button block
                                        style={{backgroundColor: '#4c6e93', height: 120, marginTop: 30, paddingTop: 20,
                                            borderColor: '#3a5471',
                                            borderStyle: 'solid',
                                            borderRadius: 0,
                                            borderRightWidth  : 2,
                                            borderBottomWidth  : 2,
                                            borderWidth  : 0,}}
                                        onPress={() => this.onLoginPress()}
                                        title="Submit">
                                    <Text style={ styles.textCompany }>Вход</Text>
                                </Button>
                            </Form>
                        </Content>
                        <KeepAwake />
                    </Container>
                );
            }
        }
        else {
            return (
                <ListPoint/>
            );
        }
    }
}

const styles = StyleSheet.create({
    cols: {
        alignContent: 'center',
    },
    viewTitle: {},
    rows: {
        height: 150,
        alignItems: 'center',
        backgroundColor: '#4c6e93',
        margin: 6,
        borderColor: '#000',
        borderStyle: 'solid',
        borderRadius: 2,
    },
    rowsDisabled: {
        height: 150,
        opacity: 0.3,
        alignItems: 'center',
        backgroundColor: '#4c6e93',
        margin: 6,
        borderColor: '#000',
        borderStyle: 'solid',
        borderRadius: 2,
    },
    rowsTitle: {
        fontSize: 12,
        fontWeight: '100',
        alignSelf: 'center',
        color: 'white',
    },
    header: {
        backgroundColor: '#4c6e93',
    },
    logo: {
        width: 300, height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    flag: {
        width: 30, height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    buttonContainer: {
        margin: 0,
    },
    container: {
        paddingTop: 80,
        backgroundColor: '#87b4e1',
        alignItems: 'center',
    },
    textCompany: {
        fontSize: 20,
        color: '#FFF',
    },
    text: {
        fontSize: 16,
        color: '#fff',
    },
});

function mapStateToProps(state) {
    return {
        options: state.options
    }
}

function matchDispatchToProps(dispatch) {
    return bindActionCreators({
        addVehicle: addVehicle,
        updateLoading: updateLoading,
        updateVehicleLoadingStatus: updateVehicleLoadingStatus,
        onChancgeLogin: onChancgeLogin,
        onChancgePassword: onChancgePassword,
        setAuthToken: setAuthToken,
        setResultTransportations: setResultTransportations,
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
        setTtnWeight
    }, dispatch)
}




export default connect(mapStateToProps, matchDispatchToProps)(Login);


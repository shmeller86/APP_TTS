import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {AsyncStorage} from "react-native";
import {Container, Header, Content, Spinner, Left, Right, Body, Text, ActionSheet} from "native-base";
import {connect} from "react-redux";
import {updateType, updateLoading} from "../actions/index";
import Login from './Login';

class MainPage extends Component {

    async componentWillMount() {

        try {
            await Expo.Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            });
            this.props.updateLoading(false);
        } catch(err) {
            console.log(err);
            this.props.updateLoading(true);
        }


        if (this.props.options.isAvaliableApi == false) {
            try {
                await fetch(this.props.options.api.server + this.props.options.api.version + '/ttc/getTodayCars');
                this.props.updateType(true);
            } catch(err) {
                this.props.updateType(false);
            }
        }

    }

    /**
     * Проверка на авторизацию водителя
     * @returns {boolean}
     */
    getLoggedStatus() {
        return (
            this.props.options.isLoggedIn
        )
    }





    render() {

        if (this.props.options.isLoading) {
            return (
                <Container>
                    <Header style={{backgroundColor: '#000'}}/>
                    <Content style={{paddingTop: 200, alignSelf: 'center'}}>
                        <Text style={{color: '#000'}}>Загружаю шрифты . . . </Text>
                        <Spinner color='#000'/>
                    </Content>
                </Container>
            );
        }
        else {
            //проверка на доступность api сервера
            if (!this.props.options.isAvaliableApi) {
                //console.log(this.props);
                return (
                    <Container>
                        <Header style={{backgroundColor: '#000'}}/>
                        <Content style={{paddingTop: 200, alignSelf: 'center'}}>
                            <Text style={{color: '#000'}}>Соединение . . . </Text>
                            <Spinner color='#000'/>
                        </Content>
                    </Container>
                );
            }
            else {
                // Если пользователь авторизован
                if (this.getLoggedStatus()) {
                    return (
                        <Container>
                            <Header />
                            <Content>
                                <Text>Все будет хорошо.</Text>
                            </Content>
                        </Container>
                    );
                }
                // Если пользователь не авторизован
                else {
                    console.log(this.props);
                    return (<Login store={this.props.options} />);
                }
            }
        }
    }

}

function mapStateToProps(state) {
    return {
        options: state.options
    }
}

function matchDispatchToProps(dispatch) {

    return bindActionCreators({updateType: updateType, updateLoading: updateLoading}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(MainPage);























import React, {Component} from "react";
import {bindActionCreators} from "redux";
import {AsyncStorage} from "react-native";
import {Container, Header, Content, Spinner, Left, Right, Body, Text, ActionSheet} from "native-base";
import {connect} from "react-redux";
import {updateType, updateLoading} from "../actions/index";
import Login from './Login';

class MainPage extends Component {

    async componentWillMount() {
        /*await AsyncStorage.getItem('token', (err, result) => {
         //console.log(result);
         if(result == null) {
         this.setState({isLoggedIn: false});
         }
         else {
         this.setState({isLoggedIn: true, token: result});
         }
         });*/

    }

    getLoading() {
        try {
            Expo.Font.loadAsync({
                'Roboto': require('native-base/Fonts/Roboto.ttf'),
                'Roboto_medium': require('native-base/Fonts/Roboto_medium.ttf'),
            });
            this.props.updateLoading(false);
            return false;
        }
        catch (err) {
            console.log(err);
            this.props.updateLoading(true);
            return true;
        }



    }

    /**
     * Проверка на авторизацию водителя
     * @returns {boolean}
     */
    getLoggedStatus() {
        return (
            this.props.options.isLoggedIn
        )
    }


    /**
     * Доступность сервера api
     * @returns {boolean}
     */
    getAvaliableApiStatus() {
        if (this.props.options.isAvaliableApi == false) {
            fetch(this.props.options.api.server + this.props.options.api.version + '/ttc/getTodayCars')
                .then(() => {
                    console.log('Дичь');
                    this.props.updateType(true);
                    return true;
                })
                .catch(() => {
                    alert('Удаленный сервер не отвечает.');
                    this.props.updateType(false);
                    console.log(this.props);
                    return false;
                });
        }
        else {
            console.log('true');
            return true;
        }

    }


    render() {
        if ({} == true) {
            return (
                <Container>
                    <Header style={{backgroundColor: '#000'}}/>
                    <Content style={{paddingTop: 200, alignSelf: 'center'}}>
                        <Text style={{color: '#000'}}>Загружаю шрифты . . . </Text>
                        <Spinner color='#000'/>
                    </Content>
                </Container>
            );
        }
        else {
            //проверка на доступность api сервера
            if (this.getAvaliableApiStatus() == false) {
                return (
                    <Container>
                        <Header style={{backgroundColor: '#000'}}/>
                        <Content style={{paddingTop: 200, alignSelf: 'center'}}>
                            <Text style={{color: '#000'}}>Соединение . . . </Text>
                            <Spinner color='#000'/>
                        </Content>
                    </Container>
                );
            }
            else {
                // Если пользователь авторизован
                if (this.getLoggedStatus()) {
                    return (
                        <Container>
                            <Header />
                            <Content>
                                <Text>Все будет хорошо.</Text>
                            </Content>
                        </Container>
                    );
                }
                // Если пользователь не авторизован
                else {
                    // console.log(this.props);
                    return (<Login store={this.props.options} />);
                }
            }
        }
    }





}

function mapStateToProps(state) {
    return {
        options: state.options
    }
}

function matchDispatchToProps(dispatch) {

    return bindActionCreators({updateType: updateType, updateLoading: updateLoading}, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(MainPage);




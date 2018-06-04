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
                <Container  style={{backgroundColor: '#4c6e93'}}>
                    <Header style={{backgroundColor: '#000'}}/>
                    <Content style={{paddingTop: 200, alignSelf: 'center'}}>
                        <Text style={{color: '#FFF'}}>Загружаю шрифты . . . </Text>
                        <Spinner color='#FFF'/>
                    </Content>
                </Container>
            );
        }
        else {
            //проверка на доступность api сервера
            if (!this.props.options.isAvaliableApi) {
                return (
                    <Container style={{backgroundColor: '#4c6e93'}}>
                        <Header style={{backgroundColor: '#000'}}/>
                        <Content style={{paddingTop: 200, alignSelf: 'center'}}>
                            <Text style={{color: '#FFF'}}>Соединение . . . </Text>
                            <Spinner color='#FFF'/>
                        </Content>
                    </Container>
                );
            }
            else {
                // Если пользователь авторизован
                if (this.getLoggedStatus()) {
                    return (
                        <Container style={{backgroundColor: '#97a9e0'}}>
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
                    return (<Login/>);
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



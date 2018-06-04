import React, { Component } from 'react';
import {View,Text} from 'react-native';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import allReducers from './app/reducers'
import Init from './app/components/Init';



const store = createStore (allReducers);

export default class App extends Component {

    render() {
        return (
            <Provider store={store}>
            <Init />
            </Provider>
        );
    }
}

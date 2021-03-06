import React, {Component} from 'react';
import { connect } from 'react-redux'
import { Text, Image, Dimensions } from 'react-native'

import LoginScreen from './Login/LoginScreen';
import EntryScreen from './AppScreens/EntryScreen';

import {dimensionsChangeAction} from './Utils/Redux/Actions/window';

class MainSplash extends Component {
    render() {
        return <Image style={{width: '100%', height: '100%'}} source={require('../resources/splash.png')}/>
    }
}

class MainApp extends Component {
    handleDimensionsChange = (newDimensions) => {
        this.props.dispatch(dimensionsChangeAction(newDimensions));
    }

    componentDidMount() {
        window.sessionId = this.props.sessionId;

        Dimensions.addEventListener('change', this.handleDimensionsChange);

        this.props.dispatch(
            dimensionsChangeAction({
                window: Dimensions.get('window'),
                screen: Dimensions.get('screen')
            })
        );
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.handleDimensionsChange);
    }

    componentDidUpdate(prevProps) {
        if ( this.props.sessionId != prevProps.sessionId ) {
            window.sessionId = this.props.sessionId;
        }
    }

    render() {
        return this.props.appLoaded ? (
            this.props.user ? (<EntryScreen/>) : (<LoginScreen/>)
        ) : <MainSplash/>;
    }
}

function mapStateToProps(state) {
    return {
        user: state.userReducer.user,
        sessionId: state.userReducer.sessionId,
        appLoaded: state.reduxData.rehydrated
    }
}

export default connect(mapStateToProps)(MainApp)

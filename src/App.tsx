import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { TouchableOpacity } from 'react-native-gesture-handler';

/*
    @react-native-community/geolocation
*/
import Styled from 'styled-components/native';
import WeatherView from '~/component/WeatherView';
const Container = Styled.SafeAreaView`
  flex: 1;
  background-color: #EEE;
`;

const App = ({}) => {
    const [latitude, setLatitude] = useState<string>();
    const [longitude, setLogitude] = useState<string>();

    const geoLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const latitude: string = JSON.stringify(
                    position.coords.latitude,
                );
                const longitude: string = JSON.stringify(
                    position.coords.longitude,
                );

                setLatitude(latitude);
                setLogitude(longitude);
            },
            error => {
                console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
        console.log('[latitude] ' + latitude + ' [longitude] ' + longitude);
    };

    geoLocation();
    return (
        <Container>
            <Text> latitude: {latitude} </Text>
            <Text> longitude: {longitude} </Text>
            <TouchableOpacity onPress={() => geoLocation()}>
                <Text> Get GeoLocation </Text>
            </TouchableOpacity>
            <WeatherView />
        </Container>
    );

    // const getPosition = () => {
    //     Geolocation.getCurrentPosition(
    //         position => {
    //             setLatitude(JSON.stringify(position.coords.latitude));
    //             setLongitude(JSON.stringify(position.coords.longitude));
    //         },
    //         error => {
    //             showError('위치 정보를 가져오는데 실패하였습니다.');
    //         },
    //     );
    // };

    // const showError = (message: string): void => {
    //     setTimeout(() => {
    //         Alert.alert(message);
    //     }, 500);
    // };
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default App;

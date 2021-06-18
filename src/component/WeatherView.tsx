import React, { useEffect, useState, useCallback } from 'react';
import { FlatList, Alert, Platform } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

// 참고 :: https://dlee0129.tistory.com/32

import Styled from 'styled-components/native';

const Container = Styled.SafeAreaView`
  flex: 1;
  background-color: #EEE;
`;

const WeatherContainer = Styled(FlatList)``;

const LoadingView = Styled.View`
    flex: 1;
    justify-content: center;
    align-items: center;
`;
const Loading = Styled.ActivityIndicator`
    margin-bottom: 16px;
`;
const LoadingLabel = Styled.Text`
  font-size: 16px;
`;

const WeatherItemContainer = Styled.View`
  height: 100%;
  justify-content: center;
  align-items: center;
`;
const Weather = Styled.Text`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: bold;
`;
const Temperature = Styled.Text`
  font-size: 16px;
`;

interface Props {}

interface IWeather {
    temperature?: number;
    weather?: string;
    isLoading: boolean;
}
const WeatherView = ({}: Props) => {
    const API_KEY = '73bd07d674cc4569f650bad6f22dc79d';
    const [jsons, setJsons] = useState();
    const [latitude, setLatitude] = useState<string>();
    const [longitude, setLongitude] = useState<string>();
    const [weatherInfo, setWeatherInfo] = useState<IWeather>({
        temperature: undefined,
        weather: undefined,
        isLoading: false,
    });

    const showError = (message: string): void => {
        setTimeout(() => {
            Alert.alert(message);
        }, 500);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getCurrentWeather = () => {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`;
        fetch(url)
            .then(response => response.json())
            .then(json => {
                setWeatherInfo({
                    temperature: json.main.temp,
                    weather: json.weather[0].main,
                    isLoading: true,
                });
            })
            .catch(); // 왜 에러처리하면, 무한루프에 빠질까?

        console.log(JSON.stringify(jsons));

        // fetch(
        //     `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&APPID=${API_KEY}&units=metric`,
        // )
        //     .then(response => response.json())
        //     .then(json => {
        //         setWeatherInfo({
        //             temperature: json.main.temp,
        //             weather: json.weather[0].main,
        //             isLoading: true,
        //         });
        //     })
        //     .catch(error => {
        //         setWeatherInfo({
        //             isLoading: true,
        //         });
        //         showError('날씨 정보를 가져오는데 실패하였습니다.');
        //     });
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const getPosition = () => {
        Geolocation.getCurrentPosition(
            position => {
                setLatitude(JSON.stringify(position.coords.latitude));
                setLongitude(JSON.stringify(position.coords.longitude));
            },
            error => {
                showError('위치 정보를 가져오는데 실패하였습니다.');
            },
        );
    };

    useEffect(() => {
        getPosition();
        getCurrentWeather();
    }, []);

    let data = [];
    const { isLoading, weather, temperature } = weatherInfo;
    if (weather && temperature) {
        data.push(weatherInfo);
    }

    return (
        <Container>
            <WeatherContainer
                onRefresh={() => getCurrentWeather()}
                refreshing={!isLoading}
                data={data}
                keyExtractor={(item, index) => {
                    return `Weather-${index}`;
                }}
                ListEmptyComponent={
                    <LoadingView>
                        <Loading size="large" color="#1976D2" />
                        <LoadingLabel>Loading...</LoadingLabel>
                    </LoadingView>
                }
                renderItem={({ item, index }) => (
                    <WeatherItemContainer>
                        <Weather>{(item as IWeather).weather}</Weather>
                        <Temperature>
                            ({(item as IWeather).temperature}°C)
                        </Temperature>
                    </WeatherItemContainer>
                )}
                contentContainerStyle={{ flex: 1 }}
            />
        </Container>
    );
};

export default WeatherView;

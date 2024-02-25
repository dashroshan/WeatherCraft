import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView, View, Image, TextInput, TouchableOpacity, Dimensions, Text, ScrollView, useWindowDimensions } from 'react-native';
import { theme } from '../theme';
import { MagnifyingGlassIcon, PaperAirplaneIcon, ClockIcon, CloudIcon, CalendarDaysIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { debounce } from 'lodash';
import { fetchLocations, fetchWeatherForecast } from '../api/weather';
import * as Progress from "react-native-progress";
import { StoreData, getData } from '../utils/asyncStorage';
import { getIcon, weatherIcons } from '../constants';

function HomeScreen(props) {
    const [showSearch, toggleSearch] = useState(false);
    const [locations, setLocations] = useState([]);
    const [weather, setWeather] = useState({});
    const [loading, setLoading] = useState(true);

    const handleLocation = (loc) => {
        setLocations([]);
        toggleSearch(false);
        setLoading(true);
        fetchWeatherForecast({
            cityName: loc.name,
            days: '7'
        }).then(data => {
            setWeather(data);
            setLoading(false);
            StoreData('city', loc.name);
        })
    }

    const handleSearch = value => {
        if (value.length > 2) {
            fetchLocations({ cityName: value }).then(data => {
                setLocations(data);
            })
        }
    }

    useEffect(() => {
        fetchWeatherData();
    }, []);

    const fetchWeatherData = async () => {
        let myCity = await getData("city");
        let cityName = "Bhubaneswar";
        if (myCity) cityName = myCity;

        fetchWeatherForecast({
            cityName: cityName,
            days: "7",
        }).then(data => {
            setWeather(data);
            setLoading(false);
        })
    }

    const handleTextDebounce = useCallback(debounce(handleSearch, 500), []);

    return (
        <View className={`min-h-screen h-full`}>
            <StatusBar style='light' />
            <Image blurRadius={70} source={require('../assets/bg.png')} className='absolute h-full w-full' />

            {
                loading ? (
                    <View className="flex-1 flex-row justify-center items-center">
                        <Progress.CircleSnail thickness={12} size={140} color="white" />
                    </View>
                ) : (
                    <SafeAreaView className="flex flex-1 mt-12">
                        {/* search section */}
                        <View style={{ height: '7%' }} className="mx-4 relative z-50">
                            <View className="flex-row justify-end items-center rounded-full" style={{ backgroundColor: showSearch ? theme.bgWhite(0.2) : 'transparent' }}>
                                {
                                    showSearch ? (
                                        <TextInput
                                            onChangeText={handleTextDebounce}
                                            placeholder='Search city'
                                            placeholderTextColor={'lightgray'}
                                            className='pl-6 h-10 flex-1 text-base text-white' />
                                    ) : null
                                }

                                <TouchableOpacity
                                    onPress={() => toggleSearch(!showSearch)}
                                    style={{ backgroundColor: theme.bgWhite(0.3) }}
                                    className="rounded-full p-3 m-1"
                                    children={<MagnifyingGlassIcon size="25" color="white" />}
                                />
                            </View>
                            {
                                locations.length > 0 && showSearch ? (
                                    <View className="absolute w-full bg-gray-300 top-16 rounded-3xl">
                                        {
                                            locations.map((loc, index) => {
                                                let showBorder = index + 1 != locations.length;
                                                let borderClass = showBorder ? ' border-b-2 border-b-gray-400' : '';
                                                return (
                                                    <TouchableOpacity
                                                        onPress={() => handleLocation(loc)}
                                                        key={index}
                                                        className={"flex-row items-center border-0 p-3 px-4 mb-1" + borderClass}
                                                    >
                                                        <MapPinIcon size={20} color='gray' />
                                                        <Text className="text-black text-lg ml-2">{loc?.name}, {loc?.country}</Text>
                                                    </TouchableOpacity>
                                                )
                                            })
                                        }
                                    </View>
                                ) : null
                            }
                        </View>

                        {/* forecast section */}
                        <View className="mx-4 flex justify-around flex-1 mb-2">
                            {/* location */}
                            <Text className="text-white text-center text-2xl font-bold">
                                {weather?.location?.name},
                                <Text className="text-lg font-semibold text-gray-300"> {" " + weather?.location?.country}</Text>
                            </Text>

                            {/* weather image */}
                            <View className="flex-row justify-center">
                                <Image
                                    className="w-52 h-52"
                                    source={getIcon(weather?.current?.condition?.icon)}
                                />
                            </View>

                            {/* degree celcius */}
                            <View className="space-y-2">
                                <Text className="text-center font-bold text-white text-6xl ml-5">
                                    {weather?.current?.temp_c}&#176;
                                </Text>
                                <Text className="text-center text-white text-xl tracking-widest">
                                    {weather?.current?.condition?.text}
                                </Text>
                            </View>

                            {/* other stats */}
                            <View className="flex-row justify-between mx-4">
                                <View className="flex-row space-x-2 items-center">
                                    <PaperAirplaneIcon size={25} color={"white"} />
                                    <Text className="text-white font-semibold text-base">{weather?.current?.wind_kph} Km/H</Text>
                                </View>

                                <View className="flex-row space-x-2 items-center">
                                    <CloudIcon size={25} color={"white"} />
                                    <Text className="text-white font-semibold text-base">{weather?.current?.humidity}%</Text>
                                </View>

                                <View className="flex-row space-x-2 items-center">
                                    <ClockIcon size={25} color={"white"} />
                                    <Text className="text-white font-semibold text-base">{weather?.forecast?.forecastday[0]?.astro?.sunrise}</Text>
                                </View>
                            </View>

                            {/* Forecast for next days */}
                            <View className="mb-2 space-y-3">
                                <View className="flex-row items-center mx-5 space-x-2">
                                    <CalendarDaysIcon size="25" color={"white"} />
                                    <Text className="text-white text-base"> Daily forecast</Text>
                                </View>
                                <ScrollView
                                    horizontal
                                    contentContainerStyle={{ paddingHorizontal: 15 }}
                                    showsHorizontalScrollIndicator={false}
                                >
                                    {
                                        weather?.forecast?.forecastday.map((item, index) => {
                                            let date = new Date(item.date);
                                            let dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).split(',')[0];

                                            return (
                                                <View
                                                    className="flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                                                    style={{ backgroundColor: theme.bgWhite(0.15) }}
                                                    key={index}
                                                >
                                                    <Image
                                                        className="w-11 h-11"
                                                        source={getIcon(item?.day?.condition?.icon)}
                                                    />
                                                    <Text className="text-white">{dayName}</Text>
                                                    <Text className="text-white text-xl font-semibold">{item?.day?.avgtemp_c}&#176;</Text>
                                                </View>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>
                        </View>
                    </SafeAreaView >
                )
            }
        </View >
    );
}

export default HomeScreen;
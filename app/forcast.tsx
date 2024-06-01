import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

const getLocalIcon = (iconCode) => {
    const iconMap = {
        '01d': require('../assets/images/01d.png'),
        '01n': require('../assets/images/01n.png'),
        '02d': require('../assets/images/02d.png'),
        '02n': require('../assets/images/02n.png'),
        '03d': require('../assets/images/03d.png'),
        '03n': require('../assets/images/03n.png'),
        '04d': require('../assets/images/04d.png'),
        '04n': require('../assets/images/04n.png'),
        '09d': require('../assets/images/09d.png'),
        '09n': require('../assets/images/09n.png'),
        '10d': require('../assets/images/10d.png'),
        '10n': require('../assets/images/10n.png'),
        '11d': require('../assets/images/11d.png'),
        '11n': require('../assets/images/11n.png'),
        '13d': require('../assets/images/13d.png'),
        '13n': require('../assets/images/13d.png'),
        '50d': require('../assets/images/50d.png'),
        '50n': require('../assets/images/50n.png')
    };
    return iconMap[iconCode];
};

const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
    return { formattedDate, formattedTime };
};

const WeatherDialog = ({ visible, onClose, weatherData }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const screenWidth = Dimensions.get('window').width;
    const { formattedDate, formattedTime } = formatDateTime(weatherData.dt_txt);

    const handleScroll = (event) => {
      const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
      setActiveSlide(slideIndex);
    };
  
    return (
      <Modal
        visible={visible}
        transparent
        animationType='fade'
        onRequestClose={onClose}
      >
        <BlurView 
            tint='dark'
            intensity={10}
            experimentalBlurMethod='dimezisBlurView' 
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <BlurView 
            style={styles.dialog}
            tint='dark'
            intensity={50}
            experimentalBlurMethod='dimezisBlurView'
            blurReductionFactor={2}
          >
            <Text style={{fontSize: 24, fontWeight: '500', color: '#ffffff',}}>{formattedTime}, {formattedDate}</Text>
            <View style={{width: screenWidth * 0.9 - 30, alignItems: 'center', justifyContent: 'center'}}>
            <Image
                style={styles.weatherIcon}
                source={getLocalIcon(weatherData.weather[0].icon)}
            />
            <Text style={styles.temperature}>{(weatherData.main.temp - 273.15).toFixed(1)}°C</Text>
            <Text style={styles.weatherDescription}>{weatherData.weather[0].description}</Text>
            </View>
            <View style={styles.detailsContainer}>
            <FlatList 
              data={[{type: 1}, {type: 2}]}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll}
              renderItem={({item}) => {
                if(item.type==1){
                return(
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: screenWidth * 0.9 - 60,
                  }}>
                    <View style={styles.detailItem}>
                      <Image style={{height: 20, width: 20}} source={require('../assets/images/temp.png')}/>
                      <Text style={styles.detailLabel}>Feels Like</Text>
                      <Text style={styles.detailValue}>{(weatherData.main.feels_like - 273.15).toFixed(1)}°C</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Image style={{height: 20, width: 20}} source={require('../assets/images/water-drop.png')}/>
                      <Text style={styles.detailLabel}>Humidity</Text>
                      <Text style={styles.detailValue}>{weatherData.main.humidity}%</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Image style={{height: 20, width: 20}} source={require('../assets/images/wind.png')} tintColor={'white'}/>
                      <Text style={styles.detailLabel}>Wind Speed</Text>
                      <Text style={styles.detailValue}>{weatherData.wind.speed} m/s</Text>
                      </View>
                  </View>
                )
              }else{
                return(
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: screenWidth * 0.9 - 60,
                  }}>
                    <View style={styles.detailItem}>
                      <Image style={{height: 20, width: 20}} source={require('../assets/images/pressure.png')}/>
                      <Text style={styles.detailLabel}>Pressure</Text>
                      <Text style={styles.detailValue}>{(weatherData.main.pressure*0.02953).toFixed(1)} inHg</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Image style={{height: 20, width: 20}} source={require('../assets/images/visibility.png')}/>
                      <Text style={styles.detailLabel}>Visibility</Text>
                      <Text style={styles.detailValue}>{weatherData.visibility/1000} km</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Image style={{height: 20, width: 20}} source={require('../assets/images/04d.png')}/>
                      <Text style={styles.detailLabel}>Cloudiness</Text>
                      <Text style={styles.detailValue}>{weatherData.clouds.all}%</Text>
                      </View>
                  </View>
                )
              }
              }}
            />
              <View style={styles.dotContainer}>
                <View style={[styles.dot, activeSlide === 0 && styles.activeDot]} />
                <View style={[styles.dot, activeSlide === 1 && styles.activeDot]} />
              </View>
            </View>
          </BlurView>
          </BlurView>
      </Modal>
    );
  };


const kelvinToCelsius = (kelvin) => (kelvin - 273.15).toFixed(1);

const WeatherCard = React.memo(({ item }) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const { formattedDate, formattedTime } = formatDateTime(item.dt_txt);

    const getLocalIcon = (iconCode) => {
        const iconMap = {
            '01d': require('../assets/images/01d.png'),
            '01n': require('../assets/images/01n.png'),
            '02d': require('../assets/images/02d.png'),
            '02n': require('../assets/images/02n.png'),
            '03d': require('../assets/images/03d.png'),
            '03n': require('../assets/images/03n.png'),
            '04d': require('../assets/images/04d.png'),
            '04n': require('../assets/images/04n.png'),
            '09d': require('../assets/images/09d.png'),
            '09n': require('../assets/images/09n.png'),
            '10d': require('../assets/images/10d.png'),
            '10n': require('../assets/images/10n.png'),
            '11d': require('../assets/images/11d.png'),
            '11n': require('../assets/images/11n.png'),
            '13d': require('../assets/images/13d.png'),
            '13n': require('../assets/images/13d.png'),
            '50d': require('../assets/images/50d.png'),
            '50n': require('../assets/images/50n.png')
        };
        return iconMap[iconCode];
    };

    return (
        <TouchableOpacity onPress={() => setDialogVisible(true)}>
            <BlurView style={styles.card} tint='dark' intensity={50} experimentalBlurMethod='none'>
                <Text style={styles.date}>{formattedDate}</Text>
                <Text style={styles.time}>{formattedTime}</Text>
                <Image source={getLocalIcon(item.weather[0].icon)} style={styles.icon} />
                <Text style={styles.pop}>{(item.pop * 100).toFixed(0)} %</Text>
                <Text style={styles.temp}>{kelvinToCelsius(item.main.temp)} °C</Text>
            </BlurView>
            <WeatherDialog visible={dialogVisible} weatherData={item}onClose={() => setDialogVisible(false)} />
        </TouchableOpacity>
    );
});

const Forecast = ({ location }) => {
    const [forecastData, setForecastData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=45c03265e187efa67c55bb6b1f4d186d`);
                const data = await response.json();
                setForecastData(data.list);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, [location]);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <FlatList
                data={forecastData}
                renderItem={({ item }) => <WeatherCard item={item} />}
                keyExtractor={(item) => item.dt.toString()}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    dContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeText: {
        color: 'white',
        fontSize: 16,
    },
    container: {
        overflow: 'hidden',
        marginBottom: 20,
        flex: 1,
        width: '100%',
        borderRadius: 24,
        alignItems: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    card: {
        overflow: 'hidden',
        borderRadius: 24,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    date: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    },
    time: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    pop: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    icon: {
        width: 60,
        height: 60,
        marginBottom: 5,
    },
    temp: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
      dialog: {
        overflow: 'hidden',
        borderRadius: 24,
        width: '90%',
        padding: 15,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 6,
      },
      overlay: {
        position: 'absolute',
        padding: 10,
        top: 100,
        left: 20,
        right: 20,
        backgroundColor: 'lightgray',
        zIndex: 1000,
        borderRadius: 24,
      },
      searchBarView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        marginTop: 50,
        width: '90%',
        borderRadius: 100,
        paddingHorizontal: 10,
      },
      location: {
        fontSize: 24,
        fontWeight: '500',
        color: '#ffffff',
      },
      temperature: {
        marginBottom: -10,
        fontWeight: 'bold',
        fontSize: 50,
        color: '#ffffff',
      },
      weatherDescription: {
        fontSize: 18,
        color: '#ffffff',
        marginBottom: 10
      },
      weatherIcon: {
        width: 120,
        height: 120,
      },
      detailsContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        borderRadius: 15,
        padding: 15,
        width: '100%',
      },
      detailItem: {
        alignItems: 'center',
      },
      detailLabel: {
        fontSize: 16,
        color: '#ffffff',
      },
      detailValue: {
        fontSize: 16,
        color: '#ffffff',
        fontWeight: 'bold',
      },
      dotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
      },
      dot: {
        width: 5,
        height: 5,
        borderRadius: 4,
        backgroundColor: 'white',
        marginHorizontal: 3,
      },
      activeDot: {
        width: 10,
      },
});

export default Forecast;

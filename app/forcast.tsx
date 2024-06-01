import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';

const getLocalIcon = (iconCode, is_day) => {
  const iconMap = {
    '1000': is_day==1 ? require('../assets/images/01d.png') : require('../assets/images/01n.png'),
    '1003': is_day==1 ? require('../assets/images/02d.png') : require('../assets/images/02n.png'),
    '1006': is_day==1 ? require('../assets/images/04d.png') : require('../assets/images/04n.png'),
    '1009': is_day==1 ? require('../assets/images/03d.png') : require('../assets/images/03n.png'),
    '1030': is_day==1 ? require('../assets/images/50d.png') : require('../assets/images/50n.png'),
    '1063': is_day==1 ? require('../assets/images/10d.png') : require('../assets/images/10n.png'),
    '1240': is_day==1 ? require('../assets/images/10d.png') : require('../assets/images/10n.png'),
    '1180': is_day==1 ? require('../assets/images/10d.png') : require('../assets/images/10n.png'),
    '1150': is_day==1 ? require('../assets/images/09d.png') : require('../assets/images/09n.png'),
    '1183': is_day==1 ? require('../assets/images/09d.png') : require('../assets/images/09n.png'),
    '1087': is_day==1 ? require('../assets/images/1087.png') : require('../assets/images/11n.png'),
    '1153': is_day==1 ? require('../assets/images/09d.png') : require('../assets/images/09n.png'),
    '1135': is_day==1 ? require('../assets/images/50d.png') : require('../assets/images/50n.png'),
    '1189': is_day==1 ? require('../assets/images/09d.png') : require('../assets/images/09n.png'),
    '1195': is_day==1 ? require('../assets/images/09d.png') : require('../assets/images/09n.png'),
    '1276': is_day==1 ? require('../assets/images/11d.png') : require('../assets/images/11n.png'),
    '1273': is_day==1 ? require('../assets/images/1087.png') : require('../assets/images/11n.png'),
    '1216': is_day==1 ? require('../assets/images/13d.png') : require('../assets/images/13d.png'),
  }
  return iconMap[iconCode];
}

const formatDateTime = (timestamp) => {
  
  const date = new Date(timestamp);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const formattedDate = `${month} ${day}`;
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; 

  const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;

  return {
      formattedDate,
      formattedTime
  };
};

const WeatherDialog = ({ visible, onClose, weatherData }) => {
    const [activeSlide, setActiveSlide] = useState(0);
    const screenWidth = Dimensions.get('window').width;
    const { formattedDate, formattedTime } = formatDateTime(weatherData.time);

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
                source={getLocalIcon(weatherData.condition.code, weatherData.is_day)}
            />
            <Text style={styles.temperature}>{(weatherData.temp_c)}°C</Text>
            <Text style={styles.weatherDescription}>{weatherData.condition.text}</Text>
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
                      <Text style={styles.detailValue}>{(weatherData.feelslike_c)}°C</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Image style={{height: 20, width: 20}} source={require('../assets/images/water-drop.png')}/>
                      <Text style={styles.detailLabel}>Humidity</Text>
                      <Text style={styles.detailValue}>{weatherData.humidity}%</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Image style={{height: 20, width: 20}} source={require('../assets/images/wind.png')} tintColor={'white'}/>
                      <Text style={styles.detailLabel}>Wind Speed</Text>
                      <Text style={styles.detailValue}>{weatherData.wind_kph} km/h</Text>
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
                      <Text style={styles.detailValue}>{(weatherData.pressure_in)} inHg</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Image style={{height: 20, width: 20}} source={require('../assets/images/visibility.png')}/>
                      <Text style={styles.detailLabel}>Visibility</Text>
                      <Text style={styles.detailValue}>{weatherData.vis_km} km</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Image style={{height: 20, width: 20}} source={require('../assets/images/04d.png')}/>
                      <Text style={styles.detailLabel}>Cloudiness</Text>
                      <Text style={styles.detailValue}>{weatherData.cloud}%</Text>
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

const WeatherCard = React.memo(({item}) => {
    const [dialogVisible, setDialogVisible] = useState(false);
    const { formattedDate, formattedTime } = formatDateTime(item.time);

    return (
        <TouchableOpacity onPress={() => setDialogVisible(true)}>
            <BlurView style={styles.card} tint='dark' intensity={50} experimentalBlurMethod='none'>
                <Text style={styles.date}>{formattedDate}</Text>
                <Text style={styles.time}>{formattedTime}</Text>
                <Image source={getLocalIcon(item.condition.code, item.is_day)} style={styles.icon} />
                <Text style={styles.pop}>{(item.chance_of_rain)} %</Text>
                <Text style={styles.temp}>{item.temp_c} °C</Text>
                
                
            </BlurView>
            <WeatherDialog visible={dialogVisible} weatherData={item} onClose={() => setDialogVisible(false) } />
        </TouchableOpacity>
    );
});

const Forecast = ({forecastday, onVisibleTimeChange }) => {
    const [forecastData, setForecastData] = useState([]);

    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
      if (viewableItems.length > 0) {
          onVisibleTimeChange && onVisibleTimeChange(viewableItems[0].item.time);
      }
  }, []);

    useEffect(() => {
      
        setForecastData(forecastday.flatMap(day => day.hour));
    }, [forecastday])

    return (
        <View style={styles.container}>
            <FlatList
                data={forecastData}
                renderItem={({ item }) => <WeatherCard item={item}/>}
                keyExtractor={(item) => item.time_epoch}
                horizontal={true}
                onViewableItemsChanged={onViewableItemsChanged}
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

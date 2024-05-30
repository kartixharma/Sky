import { BlurView } from 'expo-blur';
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, ImageBackground, TextInput, SafeAreaView, ScrollView, TouchableOpacity, FlatList, Dimensions, Alert } from 'react-native';
import Forcast from './forcast';
import TemperatureGraph from './graph';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';

const YourComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [query, setQuery] = useState('');
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Bengaluru');
  const [loading, setLoading] = useState(false);
  const screenWidth = Dimensions.get('window').width;
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeSlide1, setActiveSlide1] = useState(0);

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveSlide(slideIndex);
  };

  const handleScroll1 = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    setActiveSlide1(slideIndex);
  };
  
  const formatTime = (time) => {
    const date = new Date(time * 1000);

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

    const TimeString = `${formattedHours}:${formattedMinutes} ${period}`;

    return TimeString;
}

  const fetchLocations = async (searchQuery) => {
    if (searchQuery.length < 3) {
      setLocations([]);
      return;
    }
    try {
      const response = await axios.get(`https://api.weatherapi.com/v1/search.json`, {
        params: {
          key: 'b955da5b8c77440fa29125936242105',
          q: searchQuery
        }
      });
      setLocations(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchData = async (Name) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${Name}&appid=45c03265e187efa67c55bb6b1f4d186d`);
      const data = await response.json();
      if (data.cod === "404") {
        Alert.alert("Error", "City not found");
      } else {
        setWeatherData(data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }
  const handleSelectLocation = (location) => {
    setSelectedLocation(location.name);
    setLocations([]);
    setQuery('');
  }

  useEffect(() => {
    fetchData(selectedLocation)
  }, [selectedLocation]);

  const getLocalIcon = (iconCode: any) => {
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
    }
    return iconMap[iconCode];
  }

  const backgroundImage = weatherData && weatherData.weather[0].icon.includes('d')
    ? require('../assets/images/image2.png')
    : require('../assets/images/image.png');
    
  return (
    <SafeAreaView style={styles.container}>
      {weatherData ? (
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
          resizeMode='cover'
        >
          <BlurView style={styles.searchBarView}
            tint='dark'
            intensity={50}
          >
        <TextInput
          style={styles.input}
          placeholderTextColor={'white'}
          placeholder="Enter location"
          value={query}
          onChangeText={(text) => {
            setQuery(text);
            fetchLocations(text);
          }}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => setQuery('')}>
            <Ionicons name="close" size={20} color="white" />
          </TouchableOpacity>
        )}
      </BlurView>
      {locations.length > 0 && (
          <View style={styles.overlay}>
            <FlatList
              data={locations}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelectLocation(item)}>
                  <Text style={{ color: 'black', margin: 8 }}>{item.name}, {item.region}, {item.country}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        )}
          <BlurView 
            style={styles.container1}
            tint='dark'
            intensity={50}
            experimentalBlurMethod='dimezisBlurView'
          >
            <Text style={styles.location}>{(weatherData.name)}, {(weatherData.sys.country)}</Text>
            <FlatList
            contentContainerStyle={{marginBottom: -10}}
              data={[
                {
                  type: 'weather',
                  icon: weatherData.weather[0].icon, 
                  temp: `${(weatherData.main.temp - 273.15).toFixed(1)}°C`,
                  desc: weatherData.weather[0].description
                },
                {
                  type: 'sun',
                  icon1: require('../assets/images/sunrise.png'),
                  icon2: require('../assets/images/sunset.png'), 
                  sunriseT: formatTime(weatherData.sys.sunrise),
                  sunsetT: formatTime(weatherData.sys.sunset),
                },
                {
                  type: 'temp',
                  icon1: require('../assets/images/high.png'),
                  icon2: require('../assets/images/low.png'), 
                  maxTemp: `${(weatherData.main.temp_max - 273.15).toFixed(1)}°C`,
                  minTemp: `${(weatherData.main.temp_min - 273.15).toFixed(1)}°C`,
                }
              ]}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              onScroll={handleScroll1}
              renderItem={({item}) => {
                if(item.type=='weather'){
                return(
                  <View style={{width: screenWidth * 0.9 - 30, alignItems: 'center', justifyContent: 'center'}}>
                  <Image
                    style={styles.weatherIcon}
                    source={getLocalIcon(item.icon)}
                  />
                  <Text style={styles.temperature}>{item.temp}</Text>
                  <Text style={styles.weatherDescription}>{item.desc}</Text>
                  </View>
                )
              } else if(item.type=='sun') {
                return (
                  <View style={{ width: screenWidth * 0.9 - 30, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                      <Image
                        style={{ width: 100, height: 100, marginRight: 60 }}
                        source={item.icon1}
                      />
                      <Image
                        style={{ width: 100, height: 100 }}
                        source={item.icon2}
                      />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <View style={{ alignItems: 'center', marginRight: 60}}>
                        <Text style={styles.detailLabel}>Sunrise</Text>
                        <Text style={{fontSize: 24,color: '#ffffff', fontWeight: 'bold'}}>{item.sunriseT}</Text>
                      </View>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.detailLabel}>Sunset</Text>
                      <Text style={{fontSize: 24,color: '#ffffff', fontWeight: 'bold'}}>{item.sunsetT}</Text>
                      </View>
                    </View>
                  </View>
                )
              }
              else {
                return (
                  <View style={{ width: screenWidth * 0.9 - 30, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Image
                      style={{ width: 60, height: 60, marginRight: 70 }}
                      source={item.icon1}
                    />
                    <Image
                      style={{ width: 60, height: 60 }}
                      source={item.icon2}
                    />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                      <View style={{ alignItems: 'center', marginRight: 60}}>
                      <Text style={styles.detailLabel}>Max</Text>
                        <Text style={{fontSize: 24,color: '#ffffff', fontWeight: 'bold'}}>{item.maxTemp}</Text>
                      </View>
                    <View style={{ alignItems: 'center' }}>
                    <Text style={styles.detailLabel}>Min</Text>
                      <Text style={{fontSize: 24,color: '#ffffff', fontWeight: 'bold'}}>{item.minTemp}</Text>
                      </View>
                    </View>
                </View>
              )
              }
              }}
            />
              <View style={[styles.dotContainer, {marginBottom: 5}]}>
                <View style={[styles.dot, activeSlide1 === 0 && styles.activeDot]} />
                <View style={[styles.dot, activeSlide1 === 1 && styles.activeDot]} />
                <View style={[styles.dot, activeSlide1 === 2 && styles.activeDot]} />
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
          <Text style={styles.title}>5-Day Forecasts</Text>
          <View style={{flex: 1, borderRadius: 24, overflow:'hidden', width: '90%', marginBottom: 5}}>
          <ScrollView showsVerticalScrollIndicator={false}>
              <Forcast location={selectedLocation}/>
              <TemperatureGraph />
          </ScrollView>
          </View>
        </ImageBackground>
      ) : (
        <ActivityIndicator size="large" color="#ffffff" />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'flex-start',
    marginVertical: 10,
    marginHorizontal: 30
  },
  input: {
    left: 5,
    height: 50,
    fontSize: 16,
    color: 'white'
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%'
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    overflow: 'hidden',
    borderRadius: 24,
    width: '90%',
    padding: 15,
    marginTop: 20,
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
    marginTop: 5,
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

export default YourComponent;

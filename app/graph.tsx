import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator, ScrollView, Text } from 'react-native';
import { LineChart } from "react-native-gifted-charts"
import { BlurView } from 'expo-blur';

const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
  const formattedTime = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
  return { formattedDate, formattedTime };
};

const TemperatureGraph = () => {
  const [forecastData, setForecastData] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          'https://api.openweathermap.org/data/2.5/forecast?q=Bengaluru&appid=45c03265e187efa67c55bb6b1f4d186d'
        );
        const data = await response.json();
        setForecastData(data);
      } catch (error) {
        console.error('Error fetching weather data: ', error);
      }
    };

    fetchWeatherData();
  }, []);

  if (!forecastData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const temperatures = forecastData.list.map(item => item.main.temp - 273.15);
  const pop = forecastData.list.map(item => item.pop * 20)
  const labels = forecastData.list.map(item => formatDateTime(item.dt_txt).formattedDate);
  
  const lineData = temperatures.map((temp, index) => ({ value: temp, date: labels[index] }));
  const lineData2 = pop.map((p, index) => ({ value: p, date: labels[index] }));

  return (
    <BlurView style={styles.container} tint='dark' intensity={50}>
      <Text></Text>
        <LineChart
            areaChart
            curved
            rotateLabel
            data={lineData}
            data2={lineData2}
            xAxisLabelTexts={labels}
            height={180}
            hideYAxisText
            showStripOnFocus
            hideAxesAndRules
            spacing={44}
            xAxisLabelTextStyle={{color: 'lightgray'}}
            initialSpacing={0}
            color1="orange"
            color2="#706bff"
            textColor1="green"
            hideDataPoints
            dataPointsColor1="blue"
            dataPointsColor2="red"
            startFillColor1="orange"
            startFillColor2="#706bff"
            startOpacity={0.8}
            endOpacity={0}
            pointerConfig={{
              pointerStripHeight: 180,
              pointerStripColor: 'lightgray',
              pointerStripWidth: 1,
              pointerColor: 'lightgray',
              radius: 4,
              pointerLabelWidth: 100,
              pointerLabelHeight: 90,
              activatePointersOnLongPress: true,
              autoAdjustPointerLabelPosition: false,
              pointerLabelComponent: items => {
                return (
                  <View
                    style={{
                      height: 90,
                      width: 80,
                      justifyContent: 'center',
                      marginTop: 40,
                      marginLeft: 10,
                    }}>
                    <Text style={{color: 'white', fontSize: 14, marginBottom:6,textAlign:'center'}}>
                      {items[0].date}
                    </Text>
                    <View style={{paddingHorizontal:14,paddingVertical:6, borderRadius:16, backgroundColor:'white'}}>
                    <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {`${items[0].value.toFixed(1)} ℃ ${items[1].value.toFixed(1)}%`}
                    </Text>
                    </View>
                  </View>
                );
              },
            }}
            />
    </BlurView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    overflow: 'hidden',
    paddingVertical: 20,
    paddingHorizontal: 10,
    width: '100%',
    borderRadius: 24,
  },
  scrollContainer: {
    borderRadius: 24,
  },
  graph: {
    borderRadius: 24,
  }
});

export default TemperatureGraph;

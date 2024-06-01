import React, { useEffect, useState } from 'react';
import { StyleSheet, View, ActivityIndicator, Text } from 'react-native';
import { LineChart } from "react-native-gifted-charts"
import { BlurView } from 'expo-blur';
import { screenWidth } from 'react-native-gifted-charts/src/utils';

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

const TemperatureGraph = ({forecastday}) => {
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    setForecastData(forecastday)
  }, [forecastday]);

  if (!forecastData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  const temperatures = forecastData.map(item => item.day.avgtemp_c);
  const pop = forecastData.map(item => item.day.daily_chance_of_rain * 0.2)
  const labels = forecastData.map(item => formatDateTime(item.date).formattedDate);
  
  const lineData = temperatures.map((temp, index) => ({ value: temp, date: labels[index] }));
  const lineData2 = pop.map((p, index) => ({ value: p, date: labels[index] }));

  return (
    <BlurView style={styles.container} tint='dark' intensity={50}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{height: 10, width: 10, backgroundColor: 'orange', borderRadius: 100, marginHorizontal: 10}}></View>
        <Text style={{fontSize: 16, color: '#ffffff'}}>Average Temperature</Text>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <View style={{height: 10, width: 10, backgroundColor: '#706bff', borderRadius: 100, margin: 10}}></View>
        <Text style={{fontSize: 16, color: '#ffffff'}}>Chance of Rain</Text>
      </View>
        <LineChart
            areaChart
            curved
            data={lineData}
            data2={lineData2}
            xAxisLabelTexts={labels}
            height={180}
            hideYAxisText
            hideAxesAndRules
            spacing={screenWidth/8}
            xAxisLabelTextStyle={{color: 'white', fontSize: 12, fontWeight: 'bold'}}
            initialSpacing={20}
            color1="orange"
            color2="#706bff"
            textColor1="white"
            textColor2='white'
            textShiftY={-5}
            textShiftX={-5}
            textFontSize={12}
            dataPointsColor1="orange"
            dataPointsColor2="#706bff"
            showValuesAsDataPointsText
            startFillColor1="orange"
            startFillColor2="#706bff"
            startOpacity={0.8}
            endOpacity={0}
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
});

export default TemperatureGraph;

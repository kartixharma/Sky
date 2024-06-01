import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator, ScrollView, Text } from 'react-native';
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
        <ActivityIndicator size="large" color="#0000ff" />
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
            hideAxesAndRules
            spacing={screenWidth/10}
            xAxisLabelTextStyle={{color: 'lightgray'}}
            initialSpacing={0}
            color1="orange"
            color2="#706bff"
            textColor1="green"
            dataPointsColor1="orange"
            dataPointsColor2="#706bff"
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
                      {`${items[0].value.toFixed(1)} ℃ ${items[1].value.toFixed(1)*10/2}%`}
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

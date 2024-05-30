import React, { useEffect, useState } from 'react';
import { Dimensions, StyleSheet, View, ActivityIndicator, ScrollView } from 'react-native';
import { Canvas, Path, Group, Text } from '@shopify/react-native-skia';
import { BlurView } from 'expo-blur';
import { scaleLinear } from 'd3-scale';
import { line, curveCardinal } from 'd3-shape';

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
  const labels = forecastData.list.map(item => item.dt_txt.split(' ')[1].slice(0, 5)); // Get time in HH:MM format

  const chartWidth = Dimensions.get('window').width * 3;
  const chartHeight = 200;
  const padding = 20;

  const xScale = scaleLinear()
    .domain([0, temperatures.length - 1])
    .range([padding, chartWidth - padding]);

  const yScale = scaleLinear()
    .domain([Math.min(...temperatures), Math.max(...temperatures)])
    .range([chartHeight - padding, padding]);

  const lineGenerator = line()
    .x((d, i) => xScale(i))
    .y(d => yScale(d))
    .curve(curveCardinal);

  const pathData = lineGenerator(temperatures);

  return (
    <BlurView style={styles.container} tint='dark' intensity={50}>
      <ScrollView horizontal contentContainerStyle={styles.scrollContainer} showsHorizontalScrollIndicator={false}>
        <Canvas style={{ width: chartWidth, height: chartHeight }}>
          <Group>
            <Path path={pathData} color="lightgray" style="stroke" strokeWidth={2} />
            {temperatures.map((temp, index) => (
              <Text
                key={`label-${index}`}
                x={xScale(index) - 10} 
                y={chartHeight - 10} 
                text={labels[index]}
                color="white"
                size={10}
              />
            ))}
            {temperatures.map((temp, index) => (
              <Text
                key={`temp-${index}`}
                x={xScale(index) - 10} 
                y={yScale(temp) - 10} 
                text={`${temp.toFixed(1)}°C`}
                color="white"
                size={10}
              />
            ))}
          </Group>
        </Canvas>
      </ScrollView>
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
    marginBottom: 20,
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

import {View, Text} from 'react-native';
import React from 'react';
import {LineChart, BarChart} from 'react-native-chart-kit';
import {rHeight, rWidth} from '../constants/PixelSize';
import {useColorScheme} from './ColorSchemeContext';
import COLORS from '../constants/Colors';

const ChartComponent = () => {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  const data = {
    labels: ['0', '5', '10', '15', '20', '25'],
    datasets: [
      {
        data: [20, 45, 28, 80, 99, 43],
      },
    ],
  };
  return (
    <View style={{alignSelf: 'center'}}>
      <BarChart
        data={data}
        width={rWidth(343)}
        height={rHeight(234)}
        yAxisLabel=""
        verticalLabelRotation={0}
        withVerticalLines={false}
        withHorizontalLines={false}
        withInnerLines={false}
        showBarTops={false}
        chartConfig={{
          decimalPlaces: 0,
          backgroundGradientFrom: '#fff',
          backgroundGradientFromOpacity: 0,
          height: 5000,
          backgroundGradientTo: isDarkTheme
            ? COLORS.dark_con
            : COLORS.light_con,
          backgroundGradientToOpacity: 0.5,
          color: (opacity = 0.3) => '#F33FAE',
          fillShadowGradient: '#F33FAE',
          fillShadowGradientOpacity: 1,
          labelColor: (opacity = 1) => (isDarkTheme ? '#ffff' : '#1D2433'),
          propsForDots: {
            r: '1', // Setting the radius to 0 will remove the dots@kalyan rai
          },
          strokeWidth: 1, // optional, default 3
          barPercentage: 0.8,
          propsForBackgroundLines: {
            strokeWidth: 0.3,
            strokeDashoffset: 20,
            color: 'red',
          },
        }}
        bezier
        withCustomBarColorFromData={false}
        flatColor={false}
        style={{marginRight: 10}}
        showValuesOnTopOfBars={false}
        spacing={0.2}
        gridMin={0}
      />
    </View>
  );
};

export default ChartComponent;

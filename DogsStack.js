import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DogsListScreen from './DogsListScreen';
import DetailScreen from './DetailScreen';

const Stack = createStackNavigator();

export default function DogsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#000',
        headerTitleStyle: {
          fontWeight: '700',
        },
      }}
    >
      <Stack.Screen 
        name="DogsList" 
        component={DogsListScreen}
        options={{ title: 'Dogs' }}
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen}
        options={({ route }) => ({ title: route.params.item.breed })}
      />
    </Stack.Navigator>
  );
}
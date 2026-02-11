import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CatsListScreen from './CatsListScreen';
import DetailScreen from './DetailScreen';

const Stack = createStackNavigator();

export default function CatsStack() {
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
        name="CatsList" 
        component={CatsListScreen}
        options={{ title: 'Cats' }}
      />
      <Stack.Screen 
        name="Detail" 
        component={DetailScreen}
        options={({ route }) => ({ title: route.params.item.breed })}
      />
    </Stack.Navigator>
  );
}
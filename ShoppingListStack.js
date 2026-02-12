import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingListScreen from './ShoppingListScreen';

const Stack = createStackNavigator();

export default function ShoppingListStack() {
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
        name="ShoppingListMain" 
        component={ShoppingListScreen}
        options={{ title: 'Shopping List' }}
      />
    </Stack.Navigator>
  );
}
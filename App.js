import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DogsStack from './DogsStack';
import CatsStack from './CatsStack';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            const icons = {
              Dogs: focused ? 'paw' : 'paw-outline',
              Cats: focused ? 'paw' : 'paw-outline',
            };

            return (
              <Ionicons
                name={icons[route.name] ?? 'help-circle-outline'}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: '#111',
          tabBarInactiveTintColor: '#999',
          headerShown: false,
        })}
      >
        <Tab.Screen name="Dogs" component={DogsStack} />
        <Tab.Screen name="Cats" component={CatsStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
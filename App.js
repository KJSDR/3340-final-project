import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Provider } from 'react-redux';
import { store } from './store';
import AllRecipesStack from './AllRecipesStack';
import FavoritesStack from './FavoritesStack';
import ShoppingListStack from './ShoppingListStack';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            'All Recipes': focused ? 'restaurant' : 'restaurant-outline',
            'Favorites': focused ? 'heart' : 'heart-outline',
            'Shopping List': focused ? 'cart' : 'cart-outline',
          };

          return (
            <Ionicons
              name={icons[route.name] ?? 'help-circle-outline'}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#002395',
        tabBarInactiveTintColor: '#999',
        headerShown: false,
      })}
    >
      <Tab.Screen name="All Recipes" component={AllRecipesStack} />
      <Tab.Screen name="Favorites" component={FavoritesStack} />
      <Tab.Screen name="Shopping List" component={ShoppingListStack} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </Provider>
  );
}
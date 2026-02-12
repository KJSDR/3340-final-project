import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import FavoritesScreen from './FavoritesScreen';
import RecipeDetailScreen from './RecipeDetailScreen';

const Stack = createStackNavigator();

export default function FavoritesStack() {
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
        name="FavoritesList" 
        component={FavoritesScreen}
        options={{ title: 'Favorites' }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen}
        options={({ route }) => ({ title: route.params.recipe.name })}
      />
    </Stack.Navigator>
  );
}
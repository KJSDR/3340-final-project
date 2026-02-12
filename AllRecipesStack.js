import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AllRecipesScreen from './AllRecipesScreen';
import RecipeDetailScreen from './RecipeDetailScreen';

const Stack = createStackNavigator();

export default function AllRecipesStack() {
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
        name="AllRecipesList" 
        component={AllRecipesScreen}
        options={{ title: 'All Recipes' }}
      />
      <Stack.Screen 
        name="RecipeDetail" 
        component={RecipeDetailScreen}
        options={({ route }) => ({ title: route.params.recipe.name })}
      />
    </Stack.Navigator>
  );
}
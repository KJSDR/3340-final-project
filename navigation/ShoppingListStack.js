import * as React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import { theme } from '../theme';

const Stack = createStackNavigator();

export default function ShoppingListStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.textPrimary,
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
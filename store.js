import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { recipes as recipesData } from './recipes';

// Async thunk to "load" recipes (simulates API call)
export const loadRecipes = createAsyncThunk(
  'recipes/loadRecipes',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate random error (10% chance)
      if (Math.random() < 0.1) {
        throw new Error('Failed to load recipes');
      }
      
      return recipesData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Recipes slice
const recipesSlice = createSlice({
  name: 'recipes',
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(loadRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Favorites slice
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    recipeIds: [], // Array of recipe IDs that are favorited
  },
  reducers: {
    toggleFavorite: (state, action) => {
      const recipeId = action.payload;
      if (state.recipeIds.includes(recipeId)) {
        state.recipeIds = state.recipeIds.filter(id => id !== recipeId);
      } else {
        state.recipeIds.push(recipeId);
      }
    },
    loadFavorites: (state, action) => {
      state.recipeIds = action.payload;
    },
  },
});

// Shopping list slice
const shoppingListSlice = createSlice({
  name: 'shoppingList',
  initialState: {
    items: [], // Array of { id, name, amount, unit, recipeId, recipeName }
  },
  reducers: {
    addToShoppingList: (state, action) => {
      const { recipeId, recipeName, ingredients } = action.payload;
      
      ingredients.forEach(ingredient => {
        const existingItem = state.items.find(
          item => item.name === ingredient.name && item.recipeId === recipeId
        );
        
        if (!existingItem) {
          state.items.push({
            id: `${recipeId}-${ingredient.id}`,
            name: ingredient.name,
            amount: ingredient.amount,
            unit: ingredient.unit,
            recipeId,
            recipeName,
          });
        }
      });
    },
    removeFromShoppingList: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearShoppingList: (state) => {
      state.items = [];
    },
    loadShoppingList: (state, action) => {
      state.items = action.payload;
    },
  },
});

// Export actions
export const { toggleFavorite, loadFavorites } = favoritesSlice.actions;
export const { addToShoppingList, removeFromShoppingList, clearShoppingList, loadShoppingList } = shoppingListSlice.actions;

// Configure store
export const store = configureStore({
  reducer: {
    recipes: recipesSlice.reducer,
    favorites: favoritesSlice.reducer,
    shoppingList: shoppingListSlice.reducer,
  },
});

// Subscribe to store changes and persist to AsyncStorage
store.subscribe(async () => {
  const state = store.getState();
  try {
    await AsyncStorage.setItem('favorites', JSON.stringify(state.favorites.recipeIds));
    await AsyncStorage.setItem('shoppingList', JSON.stringify(state.shoppingList.items));
  } catch (error) {
    console.error('Error saving to AsyncStorage:', error);
  }
});

// Load persisted state on app start
export const loadPersistedState = async () => {
  try {
    const favorites = await AsyncStorage.getItem('favorites');
    const shoppingList = await AsyncStorage.getItem('shoppingList');
    
    if (favorites) {
      store.dispatch(loadFavorites(JSON.parse(favorites)));
    }
    if (shoppingList) {
      store.dispatch(loadShoppingList(JSON.parse(shoppingList)));
    }
  } catch (error) {
    console.error('Error loading from AsyncStorage:', error);
  }
};
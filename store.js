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
    recipeIds: [],
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
    items: [],
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

// Debounce helper — prevents thrashing AsyncStorage on rapid dispatches
let saveTimer = null;
const debouncedSave = (fn, delay = 300) => {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(fn, delay);
};

// Subscribe to store changes and persist to AsyncStorage
// Only saves favorites and shoppingList (recipes are static data)
store.subscribe(() => {
  const state = store.getState();
  AsyncStorage.multiSet([
    ['favorites', JSON.stringify(state.favorites.recipeIds)],
    ['shoppingList', JSON.stringify(state.shoppingList.items)],
  ]).catch(error => console.error('Error saving to AsyncStorage:', error));
});

// Load persisted state on app start
// Returns a Promise so App.js can await it before rendering
export const loadPersistedState = async () => {
  try {
    const results = await AsyncStorage.multiGet(['favorites', 'shoppingList']);
    const favoritesRaw = results[0][1];
    const shoppingListRaw = results[1][1];

    if (favoritesRaw) {
      store.dispatch(loadFavorites(JSON.parse(favoritesRaw)));
    }
    if (shoppingListRaw) {
      store.dispatch(loadShoppingList(JSON.parse(shoppingListRaw)));
    }
  } catch (error) {
    console.error('Error loading from AsyncStorage:', error);
  }
};
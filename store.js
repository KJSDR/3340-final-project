import { configureStore, createSlice } from '@reduxjs/toolkit';

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
  },
});

// Export actions
export const { toggleFavorite } = favoritesSlice.actions;
export const { addToShoppingList, removeFromShoppingList, clearShoppingList } = shoppingListSlice.actions;

// Configure store
export const store = configureStore({
  reducer: {
    favorites: favoritesSlice.reducer,
    shoppingList: shoppingListSlice.reducer,
  },
});
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSelector } from 'react-redux';
import { theme } from "./theme";

export default function FavoritesScreen({ navigation }) {
  const favoriteIds = useSelector((state) => state.favorites.recipeIds);
  const recipes = useSelector((state) => state.recipes.data);

  const favoriteRecipes = recipes.filter((recipe) =>
    favoriteIds.includes(recipe.id)
  );

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      <Text style={styles.recipeName}>{item.name}</Text>
      <View style={styles.recipeInfo}>
        <Text style={styles.cuisineText}>{item.cuisine}</Text>
        <Text style={styles.infoText}>⏱ {item.prepTime}</Text>
        <Text style={styles.infoText}>🍽 {item.servings} servings</Text>
      </View>
    </TouchableOpacity>
  );

  if (favoriteRecipes.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No favorites yet!</Text>
        <Text style={styles.emptySubtext}>
          Tap the heart icon on any recipe to add it here.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteRecipes}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeItem}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  emptyText: {
    fontSize: theme.typography.heading,
    fontWeight: "700",
    marginBottom: theme.spacing.sm,
    color: theme.colors.textPrimary,
  },
  emptySubtext: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  listContent: {
    padding: theme.spacing.sm + 4,
  },
  recipeCard: {
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    marginBottom: theme.spacing.sm + 4,
  },
  recipeName: {
    fontSize: theme.typography.title,
    fontWeight: "600",
    marginBottom: theme.spacing.sm - 2,
  },
  recipeInfo: {
    flexDirection: "row",
    gap: theme.spacing.sm + 4,
    flexWrap: "wrap",
  },
  cuisineText: {
    fontSize: theme.typography.label,
    color: theme.colors.textPrimary,
    fontWeight: "600",
  },
  infoText: {
    fontSize: theme.typography.label,
    color: theme.colors.textSecondary,
  },
});
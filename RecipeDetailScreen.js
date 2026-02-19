import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite, addToShoppingList } from './store';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from "./theme";

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;
  const dispatch = useDispatch();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isFavorite = useSelector((state) =>
    state.favorites.recipeIds.includes(recipe.id)
  );

  const handleToggleFavorite = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    dispatch(toggleFavorite(recipe.id));

    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.3,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleAddToShoppingList = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    dispatch(addToShoppingList({
      recipeId: recipe.id,
      recipeName: recipe.name,
      ingredients: recipe.ingredients,
    }));
    alert(`Added ingredients to shopping list!`);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.headerButton}
        >
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? theme.colors.danger : theme.colors.primary}
            />
          </Animated.View>
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorite, scaleAnim]);

  return (
    <ScrollView style={styles.container}>
      {recipe.imageUrl && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: recipe.imageUrl }}
            style={styles.recipeImage}
            resizeMode="cover"
          />
          <View style={styles.categoryOverlay}>
            <Text style={styles.categoryOverlayText}>{recipe.category}</Text>
          </View>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.infoSection}>
          {[
            ['Cuisine', recipe.cuisine],
            ['Prep Time', recipe.prepTime],
            ['Cook Time', recipe.cookTime],
            ['Servings', recipe.servings],
          ].map(([label, value]) => (
            <View key={label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{label}:</Text>
              <Text style={styles.infoValue}>{value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <TouchableOpacity
              onPress={handleAddToShoppingList}
              style={styles.addButton}
            >
              <Ionicons name="cart-outline" size={20} color={theme.colors.background} />
              <Text style={styles.addButtonText}>Add to List</Text>
            </TouchableOpacity>
          </View>

          {recipe.ingredients.map((ingredient) => (
            <View key={ingredient.id} style={styles.ingredientRow}>
              <Text style={styles.ingredientText}>
                • {ingredient.amount} {ingredient.unit} {ingredient.name}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instructions</Text>
          {recipe.instructions.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  imageContainer: {
    width: "100%",
    height: 250,
    position: "relative",
  },
  recipeImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    position: "absolute",
    top: theme.spacing.md,
    right: theme.spacing.md,
    backgroundColor: theme.colors.danger,
    paddingHorizontal: theme.spacing.sm + 4,
    paddingVertical: theme.spacing.sm - 2,
    borderRadius: theme.radius.lg,
  },
  categoryOverlayText: {
    color: theme.colors.background,
    fontSize: theme.typography.label,
    fontWeight: "700",
  },
  content: {
    padding: theme.spacing.md,
  },
  headerButton: {
    marginRight: theme.spacing.md,
    padding: theme.spacing.sm,
  },
  infoSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.lg - 4,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm - 2,
  },
  infoLabel: {
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  infoValue: {
    fontSize: theme.typography.body,
    fontWeight: "600",
    color: theme.colors.primary,
  },
  section: {
    marginBottom: theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.sm + 4,
  },
  sectionTitle: {
    fontSize: theme.typography.heading,
    fontWeight: "700",
    marginBottom: theme.spacing.sm + 4,
    color: theme.colors.primary,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm + 4,
    borderRadius: theme.radius.sm,
    gap: theme.spacing.sm - 2,
  },
  addButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.label,
    fontWeight: "600",
  },
  ingredientRow: {
    paddingVertical: theme.spacing.sm - 2,
  },
  ingredientText: {
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: theme.spacing.md,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: theme.spacing.sm + 4,
    marginTop: 2,
  },
  stepNumberText: {
    color: theme.colors.background,
    fontSize: theme.typography.body,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    fontSize: theme.typography.body,
    lineHeight: 24,
  },
});
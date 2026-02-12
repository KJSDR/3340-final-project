import React from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { toggleFavorite, addToShoppingList } from './store';
import { Ionicons } from '@expo/vector-icons';

export default function RecipeDetailScreen({ route, navigation }) {
  const { recipe } = route.params;
  const dispatch = useDispatch();
  
  const isFavorite = useSelector((state) => 
    state.favorites.recipeIds.includes(recipe.id)
  );

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(recipe.id));
  };

  const handleAddToShoppingList = () => {
    dispatch(addToShoppingList({
      recipeId: recipe.id,
      recipeName: recipe.name,
      ingredients: recipe.ingredients,
    }));
    
    // Show confirmation
    alert(`Added ingredients to shopping list!`);
  };

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={handleToggleFavorite}
          style={styles.headerButton}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={24}
            color={isFavorite ? "#ED2939" : "#002395"}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, isFavorite]);

  return (
    <ScrollView style={styles.container}>
      {/* Recipe Image */}
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
        {/* Recipe Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cuisine:</Text>
            <Text style={styles.infoValue}>{recipe.cuisine}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prep Time:</Text>
            <Text style={styles.infoValue}>{recipe.prepTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Cook Time:</Text>
            <Text style={styles.infoValue}>{recipe.cookTime}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Servings:</Text>
            <Text style={styles.infoValue}>{recipe.servings}</Text>
          </View>
        </View>

        {/* Ingredients */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            <TouchableOpacity
              onPress={handleAddToShoppingList}
              style={styles.addButton}
            >
              <Ionicons name="cart-outline" size={20} color="#fff" />
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

        {/* Instructions */}
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
    backgroundColor: "#fff",
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
    top: 16,
    right: 16,
    backgroundColor: "#ED2939",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  categoryOverlayText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
  content: {
    padding: 16,
  },
  headerButton: {
    marginRight: 16,
    padding: 8,
  },
  infoSection: {
    backgroundColor: "#f9f9f9",
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#002395",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  infoLabel: {
    fontSize: 16,
    color: "#666",
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002395",
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#002395",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#002395",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  ingredientRow: {
    paddingVertical: 6,
  },
  ingredientText: {
    fontSize: 16,
    lineHeight: 24,
  },
  stepRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#002395",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
});
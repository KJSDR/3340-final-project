import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { getRecipesByCuisine, recipes } from "./recipes";

export default function AllRecipesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter recipes based on search
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group filtered recipes by cuisine
  const sections = getRecipesByCuisine().map((section) => ({
    ...section,
    data: section.data.filter((recipe) =>
      filteredRecipes.some((r) => r.id === recipe.id)
    ),
  })).filter((section) => section.data.length > 0);

  const renderRecipeItem = ({ item }) => (
    <TouchableOpacity
      style={styles.recipeCard}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
    >
      <Text style={styles.recipeName}>{item.name}</Text>
      <View style={styles.recipeInfo}>
        <Text style={styles.infoText}>⏱ {item.prepTime}</Text>
        <Text style={styles.infoText}>🍽 {item.servings} servings</Text>
      </View>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => {
    const flags = {
      'French': '🇫🇷',
      'Danish': '🇩🇰',
    };

    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {title} {flags[title] || ''}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search recipes..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderRecipeItem}
        renderSectionHeader={renderSectionHeader}
        contentContainerStyle={styles.listContent}
        stickySectionHeadersEnabled={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchInput: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 12,
  },
  sectionHeader: {
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
  },
  recipeCard: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    backgroundColor: "#fff",
  },
  recipeName: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
  },
  recipeInfo: {
    flexDirection: "row",
    gap: 16,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
});
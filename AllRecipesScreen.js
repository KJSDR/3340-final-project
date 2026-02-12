import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { getRecipesByCuisine, recipes, getCategories } from "./recipes";

export default function AllRecipesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const categories = ["All", ...getCategories()];
  
  // Filter recipes based on search and category
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
        <Text style={styles.categoryBadge}>{item.category}</Text>
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

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryScrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === category && styles.categoryButtonTextActive
            ]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
  categoryScroll: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryScrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#002395",
    backgroundColor: "#fff",
    width: 100,
    alignItems: "center",
  },
  categoryButtonActive: {
    backgroundColor: "#002395",
  },
  categoryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#002395",
  },
  categoryButtonTextActive: {
    color: "#fff",
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
    gap: 12,
    alignItems: "center",
  },
  categoryBadge: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
  },
});
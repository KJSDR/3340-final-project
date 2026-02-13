import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { loadRecipes } from './store';
import { getRecipesByCuisine, getCategories } from "./recipes";

export default function AllRecipesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const dispatch = useDispatch();
  
  const { data: recipes, loading, error } = useSelector((state) => state.recipes);
  const categories = ["All", ...getCategories()];
  
  useEffect(() => {
    dispatch(loadRecipes());
  }, []);
  
  const handleRefresh = () => {
    dispatch(loadRecipes());
  };
  
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

  if (loading && recipes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#002395" />
        <Text style={styles.loadingText}>Loading recipes...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
            <Text 
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive
              ]}
              numberOfLines={1}
            >
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
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={handleRefresh}
            tintColor="#002395"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 18,
    color: "#ED2939",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#002395",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
    minWidth: 90,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryButtonActive: {
    backgroundColor: "#002395",
  },
  categoryButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#002395",
    textAlign: "center",
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
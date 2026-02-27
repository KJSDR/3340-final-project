import React, { useState, useEffect, useRef } from "react";
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
  Animated,
  PanResponder,
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { loadRecipes, toggleFavorite } from '../store';
import { getRecipesByCuisine, getCategories } from '../data/recipes';
import { theme } from "../theme";

const SWIPE_THRESHOLD = 80;

function SwipeableRecipeCard({ item, isFavorite, onPress, onToggleFavorite }) {
  const translateX = useRef(new Animated.Value(0)).current;
  const actionOpacity = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) =>
        Math.abs(gestureState.dx) > 8 && Math.abs(gestureState.dy) < 20,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
          actionOpacity.setValue(Math.min(1, Math.abs(gestureState.dx) / SWIPE_THRESHOLD));
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx < -SWIPE_THRESHOLD) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onToggleFavorite();
        }
        Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 5 }).start();
        Animated.timing(actionOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      },
    })
  ).current;

  return (
    <View style={styles.swipeWrapper}>
      <Animated.View
        style={[
          styles.favoriteBackground,
          { opacity: actionOpacity, backgroundColor: isFavorite ? '#fff0f0' : '#f0f4ff' },
        ]}
      >
        <Ionicons
          name={isFavorite ? 'heart-dislike' : 'heart'}
          size={22}
          color={isFavorite ? theme.colors.danger : theme.colors.primary}
        />
        <Text style={[styles.favoriteActionText, { color: isFavorite ? theme.colors.danger : theme.colors.primary }]}>
          {isFavorite ? 'Unfavorite' : 'Favorite'}
        </Text>
      </Animated.View>

      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        <TouchableOpacity style={styles.recipeCard} onPress={onPress} activeOpacity={0.8}>
          <View style={styles.recipeCardInner}>
            <View style={styles.recipeCardContent}>
              <Text style={styles.recipeName}>{item.name}</Text>
              <View style={styles.recipeInfo}>
                <Text style={styles.categoryBadge}>{item.category}</Text>
                <Text style={styles.infoText}>⏱ {item.prepTime}</Text>
                <Text style={styles.infoText}>🍽 {item.servings} servings</Text>
              </View>
            </View>
            {isFavorite && (
              <Ionicons name="heart" size={16} color={theme.colors.danger} />
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

export default function AllRecipesScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const dispatch = useDispatch();

  const { data: recipes, loading, error } = useSelector((state) => state.recipes);
  const favoriteIds = useSelector((state) => state.favorites.recipeIds);
  const categories = ["All", ...getCategories()];

  useEffect(() => {
    dispatch(loadRecipes());
  }, []);

  const handleRefresh = () => {
    dispatch(loadRecipes());
  };

  const filteredRecipes = recipes.filter((recipe) => {
    const matchesSearch = recipe.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || recipe.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sections = getRecipesByCuisine().map((section) => ({
    ...section,
    data: section.data.filter((recipe) =>
      filteredRecipes.some((r) => r.id === recipe.id)
    ),
  })).filter((section) => section.data.length > 0);

  const renderRecipeItem = ({ item }) => (
    <SwipeableRecipeCard
      item={item}
      isFavorite={favoriteIds.includes(item.id)}
      onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
      onToggleFavorite={() => dispatch(toggleFavorite(item.id))}
    />
  );

  const renderSectionHeader = ({ section: { title } }) => {
    const flags = { 'French': '🇫🇷', 'Danish': '🇩🇰' };
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title} {flags[title] || ''}</Text>
      </View>
    );
  };

  if (loading && recipes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
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
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryButtonText,
                selectedCategory === category && styles.categoryButtonTextActive,
              ]}
              numberOfLines={1}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.hint}>← Swipe left on a recipe to favorite it</Text>

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
            tintColor={theme.colors.primary}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.sm + 4,
    fontSize: theme.typography.body,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: theme.typography.heading,
    color: theme.colors.danger,
    textAlign: "center",
    marginBottom: theme.spacing.lg - 4,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.md + 8,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: theme.radius.sm,
  },
  retryButtonText: {
    color: theme.colors.background,
    fontSize: theme.typography.body,
    fontWeight: "600",
  },
  searchContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchInput: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: theme.typography.body,
  },
  categoryScroll: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  categoryScrollContent: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    gap: theme.spacing.sm,
  },
  categoryButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.background,
    minWidth: 90,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryButtonActive: {
    backgroundColor: theme.colors.primary,
  },
  categoryButtonText: {
    fontSize: theme.typography.small + 1,
    fontWeight: "600",
    color: theme.colors.primary,
    textAlign: "center",
  },
  categoryButtonTextActive: {
    color: theme.colors.background,
  },
  hint: {
    fontSize: theme.typography.small,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 6,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  listContent: {
    paddingBottom: theme.spacing.sm + 4,
  },
  sectionHeader: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.typography.heading,
    fontWeight: "700",
    color: theme.colors.textPrimary,
  },
  swipeWrapper: {
    overflow: 'hidden',
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
  },
  favoriteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  favoriteActionText: {
    fontSize: theme.typography.small,
    fontWeight: '700',
  },
  recipeCard: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    backgroundColor: theme.colors.background,
  },
  recipeCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  recipeCardContent: {
    flex: 1,
  },
  recipeName: {
    fontSize: theme.typography.title,
    fontWeight: "600",
    marginBottom: theme.spacing.sm - 2,
  },
  recipeInfo: {
    flexDirection: "row",
    gap: theme.spacing.sm + 4,
    alignItems: "center",
  },
  categoryBadge: {
    fontSize: theme.typography.small,
    fontWeight: "600",
    color: theme.colors.textSecondary,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 3,
    borderRadius: theme.radius.sm - 4,
  },
  infoText: {
    fontSize: theme.typography.label,
    color: theme.colors.textSecondary,
  },
});
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromShoppingList, clearShoppingList } from './store';
import { Ionicons } from '@expo/vector-icons';
import { theme } from "./theme";

export default function ShoppingListScreen() {
  const dispatch = useDispatch();
  const shoppingItems = useSelector((state) => state.shoppingList.items);

  const handleRemoveItem = (itemId) => {
    dispatch(removeFromShoppingList(itemId));
  };

  const handleClearAll = () => {
    dispatch(clearShoppingList());
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDetails}>
          {item.amount} {item.unit} — {item.recipeName}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveItem(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={24} color={theme.colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  if (shoppingItems.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Shopping list is empty!</Text>
        <Text style={styles.emptySubtext}>
          Add ingredients from any recipe to build your list.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          {shoppingItems.length} {shoppingItems.length === 1 ? 'item' : 'items'}
        </Text>
        <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={shoppingItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 4,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerText: {
    fontSize: theme.typography.body,
    fontWeight: "600",
    color: theme.colors.textPrimary,
  },
  clearButton: {
    paddingVertical: theme.spacing.sm - 2,
    paddingHorizontal: theme.spacing.sm + 4,
  },
  clearButtonText: {
    fontSize: theme.typography.body,
    color: theme.colors.danger,
    fontWeight: "600",
  },
  listContent: {
    padding: theme.spacing.sm + 4,
  },
  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: theme.colors.background,
    marginBottom: theme.spacing.sm + 4,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: theme.typography.body,
    fontWeight: "600",
    marginBottom: theme.spacing.sm - 4,
  },
  itemDetails: {
    fontSize: theme.typography.label,
    color: theme.colors.textSecondary,
  },
  removeButton: {
    padding: theme.spacing.sm,
  },
});
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
          {item.amount} {item.unit} - {item.recipeName}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => handleRemoveItem(item.id)}
        style={styles.removeButton}
      >
        <Ionicons name="close-circle" size={24} color="#999" />
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
    backgroundColor: "#fff",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  emptySubtext: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  clearButtonText: {
    fontSize: 16,
    color: "#ED2939",
    fontWeight: "600",
  },
  listContent: {
    padding: 12,
  },
  itemCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemDetails: {
    fontSize: 14,
    color: "#666",
  },
  removeButton: {
    padding: 8,
  },
});
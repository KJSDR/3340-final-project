import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Animated,
  PanResponder,
} from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { removeFromShoppingList, clearShoppingList } from '../store';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { theme } from "../theme";

const SWIPE_THRESHOLD = 80;

function SwipeableItem({ item, onRemove }) {
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
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          Animated.timing(translateX, {
            toValue: -500,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onRemove());
        } else {
          Animated.spring(translateX, { toValue: 0, useNativeDriver: true, friction: 5 }).start();
          Animated.timing(actionOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start();
        }
      },
    })
  ).current;

  return (
    <View style={styles.swipeWrapper}>
      <Animated.View style={[styles.deleteBackground, { opacity: actionOpacity }]}>
        <Ionicons name="trash" size={22} color="#fff" />
        <Text style={styles.deleteText}>Delete</Text>
      </Animated.View>

      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        <View style={styles.itemCard}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              {item.amount} {item.unit} — {item.recipeName}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
}

export default function ShoppingListScreen() {
  const dispatch = useDispatch();
  const shoppingItems = useSelector((state) => state.shoppingList.items);

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
        <TouchableOpacity onPress={() => dispatch(clearShoppingList())} style={styles.clearButton}>
          <Text style={styles.clearButtonText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.hint}>← Swipe left to delete</Text>

      <FlatList
        data={shoppingItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <SwipeableItem
            item={item}
            onRemove={() => dispatch(removeFromShoppingList(item.id))}
          />
        )}
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
    padding: theme.spacing.sm + 4,
    gap: theme.spacing.sm + 4,
  },
  swipeWrapper: {
    borderRadius: theme.radius.md,
    overflow: 'hidden',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 100,
    backgroundColor: theme.colors.danger,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  deleteText: {
    color: '#fff',
    fontSize: theme.typography.small,
    fontWeight: '700',
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
});
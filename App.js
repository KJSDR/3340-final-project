import { StatusBar } from "expo-status-bar";
import React, { useMemo, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TextInput,
} from "react-native";

import { cats, dogs } from "./breeds";

function FeatureRow({ name, value }) {
  const percent = Math.max(0, Math.min(100, (value / 5) * 100));
  const stars = "⭐️".repeat(Math.max(0, Math.min(5, value)));

  return (
    <View style={styles.featureRow}>
      <Text style={styles.featureName} numberOfLines={1}>
        {name}
      </Text>

      <View style={styles.featureRight}>
        <View style={styles.barOuter}>
          <View style={[styles.barInner, { width: `${percent}%` }]} />
        </View>

        <Text style={styles.stars}>{stars}</Text>

        <Text style={styles.featureValue}>{value}</Text>
      </View>
    </View>
  );
}

function BreedRow({ item }) {
  const featureKeys = useMemo(
    () => Object.keys(item).filter((k) => k !== "breed"),
    [item]
  );

  return (
    <View style={styles.breedCard}>
      <Text style={styles.breedTitle}>{item.breed}</Text>

      {featureKeys.length === 0 ? (
        <Text style={styles.noFeatures}>No features listed.</Text>
      ) : (
        featureKeys.map((key) => (
          <FeatureRow key={key} name={key} value={item[key]} />
        ))
      )}
    </View>
  );
}

export default function App() {
  const [show, setShow] = useState("dogs");
  const [searchQuery, setSearchQuery] = useState("");
  const data = show === "dogs" ? dogs : cats;
  const filteredData = data.filter((items) => 
    item.breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>By Breed</Text>

        <View style={styles.toggle}>
          <Pressable
            style={[styles.toggleBtn, show === "dogs" && styles.toggleBtnActive]}
            onPress={() => setShow("dogs")}
          >
            <Text style={styles.toggleText}>Dogs</Text>
          </Pressable>
          <Pressable
            style={[styles.toggleBtn, show === "cats" && styles.toggleBtnActive]}
            onPress={() => setShow("cats")}
          >
            <Text style={styles.toggleText}>Cats</Text>
          </Pressable>
        </View>
      </View>

      <View style = {styles}

      <FlatList
        style={styles.list}
        contentContainerStyle={styles.listContent}
        data={data}
        keyExtractor={(item) => item.breed}
        renderItem={({ item }) => <BreedRow item={item} />}
      />

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },

  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 8,
  },

  toggle: {
    flexDirection: "row",
    gap: 8,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  toggleBtnActive: {
    borderColor: "#999",
  },
  toggleText: {
    fontSize: 16,
    fontWeight: "600",
  },

  //challenge 2
  list: {
    flex: 1,
  },
  listContent: {
    padding: 12,
    gap: 12,
  },

  //breed row
  breedCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 14,
    padding: 12,
  },
  breedTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
  },
  noFeatures: {
    fontSize: 14,
    color: "#666",
  },

  //challenge 5
  featureRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: "#f2f2f2",
  },
  featureName: {
    flex: 1,
    fontSize: 16,
    paddingRight: 10,
  },
  featureRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  featureValue: {
    width: 18,
    textAlign: "right",
    fontSize: 16,
    fontWeight: "700",
  },

  //challenge 6
  barOuter: {
    width: 90,
    height: 10,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#ddd",
    overflow: "hidden",
  },
  barInner: {
    height: "100%",
    backgroundColor: "#111",
  },

  //challenge 7
  stars: {
    fontSize: 14,
  },
});

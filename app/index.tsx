import React, { useState, useEffect } from "react";
import {
  Image,
  StyleSheet,
  View,
  TextInput,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const denominations = [1, 5, 10, 20, 50, 100, 200, 500, 1000];

export default function HomeScreen() {
  const [counts, setCounts] = useState(denominations.map(() => 0));
  const [subtotals, setSubtotals] = useState(denominations.map(() => 0));
  const [total, setTotal] = useState(0);
  const [history, setHistory] = useState<
    { total: number; date: string; denominations: number[] }[]
  >([]);

  useEffect(() => {
    // Calculate subtotals
    const newSubtotals = denominations.map(
      (denomination, index) => denomination * counts[index]
    );
    setSubtotals(newSubtotals);

    // Calculate total
    const newTotal = newSubtotals.reduce((acc, val) => acc + val, 0);
    setTotal(newTotal);
  }, [counts]);

  const handleCountChange = (index: number, value: string) => {
    const newCounts = [...counts];
    newCounts[index] = parseInt(value || "0", 10);
    setCounts(newCounts);
  };

  const handleClear = () => {
    const now = new Date();
    const dateString = now.toLocaleDateString();
    const timeString = now.toLocaleTimeString();

    if (total !== 0) {
      setHistory([
        ...history,
        {
          total: total,
          date: `${dateString} ${timeString}`,
          denominations: [...counts],
        },
      ]);
    }
    setCounts(denominations.map(() => 0));
  };

  /* const handleClear = () => {
    setCounts(denominations.map(() => 0));
  }; */

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#A1CEDC", dark: "#1D3D47" }}
      headerImage={
        <Image
          source={require("@/assets/images/billetes.jpg")}
          style={styles.reactLogo}
        />
      }
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.titleContainer}>
          <ThemedText style={{ fontSize: 15, fontWeight: "bold" }}>
            Valor
          </ThemedText>
          <ThemedText style={{ fontSize: 15, fontWeight: "bold" }}>
            Cantidad
          </ThemedText>
          <ThemedText style={{ fontSize: 15, fontWeight: "bold" }}>
            Subtotal
          </ThemedText>
        </View>

        <ThemedView style={styles.container}>
          <ScrollView>
            {denominations.map((denomination, index) => (
              <View key={denomination} style={styles.denominationRow}>
                <ThemedText style={styles.denominationLabel}>
                  ${denomination}
                </ThemedText>
                <TextInput
                  placeholder='0'
                  returnKeyType='next'
                  value={counts[index].toString()}
                  onChangeText={(text) => handleCountChange(index, text)}
                  autoCapitalize='none'
                  keyboardType='number-pad'
                  style={styles.input}
                />
                <ThemedText style={styles.subtotal}>
                  ${subtotals[index]}
                </ThemedText>
              </View>
            ))}

            <ThemedText style={styles.total}>Total: ${total}</ThemedText>

            <Pressable style={[styles.btnlimpiar]} onPress={handleClear}>
              <ThemedText style={{ color: "white" }}>Limpiar</ThemedText>
            </Pressable>

            <ThemedText style={styles.historyTitle}>Historial:</ThemedText>
            {history.map(
              (
                item: { total: number; date: string; denominations: number[] },
                index
              ) => (
                <View key={index} style={styles.historyItem}>
                  <ThemedText>
                    {item.date} - Total: ${item.total}
                  </ThemedText>
                  <View style={styles.historyDenominations}>
                    {denominations.map((denomination, i) => (
                      <ThemedText key={i}>
                        ${denomination}: {item.denominations[i]}/
                      </ThemedText>
                    ))}
                  </View>
                </View>
              )
            )}
          </ScrollView>
        </ThemedView>
      </KeyboardAvoidingView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  titleContainer: {
    //flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  denominationRow: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 5,
    //backgroundColor: "red",
  },
  denominationLabel: {
    //flex: 0.3,
    fontSize: 16,
    width: 55,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 4,
    flex: 0.8,
    marginHorizontal: 10,
    backgroundColor: "#FCF8FF",
  },
  subtotal: {
    flex: 0.3,
    fontSize: 16,
    textAlign: "center",
  },
  total: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
    textAlign: "right",
    padding: 5,
  },
  btnlimpiar: {
    borderRadius: 5,
    padding: 10,
    width: "100%",
    height: 40,
    elevation: 2,
    alignItems: "center",
    backgroundColor: "red",
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
  },
  historyItem: {
    marginTop: 10,
    padding: 10,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
  },
  historyDenominations: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
});

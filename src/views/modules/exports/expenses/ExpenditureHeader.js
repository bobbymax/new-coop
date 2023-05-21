import React from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";

const borderColor = "#028910";
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderBottomColor: "#27ae60",
    backgroundColor: "#028910",
    borderBottomWidth: 1,
    alignItems: "center",
    textAlign: "center",
    flexGrow: 1,
    textTransform: "uppercase",
    color: "#fff",
  },
  beneficiary: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
  },
  amount: {
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
  },
  head: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
  },
  purpose: {
    width: "40%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
  },
});

const ExpenditureHeader = () => {
  return (
    <>
      <View style={styles.container}>
        <Text style={styles.beneficiary}>BENEFICIARY</Text>
        <Text style={styles.amount}>AMOUNT</Text>
        <Text style={styles.head}>BUDGET</Text>
        <Text style={styles.purpose}>PURPOSE</Text>
      </View>
    </>
  );
};

export default ExpenditureHeader;

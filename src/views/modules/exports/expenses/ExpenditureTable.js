import React from "react";
import { View, StyleSheet } from "@react-pdf/renderer";
import ExpenditureHeader from "./ExpenditureHeader";
import ExpenditureRow from "./ExpenditureRow";

const styles = StyleSheet.create({
  tableContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    margin: 18,
    borderWidth: 1,
    borderColor: "#028910",
  },
});

const ExpenditureTable = ({ expenditures }) => {
  return (
    <View style={styles.tableContainer}>
      <ExpenditureHeader />
      <ExpenditureRow items={expenditures} />
    </View>
  );
};

export default ExpenditureTable;

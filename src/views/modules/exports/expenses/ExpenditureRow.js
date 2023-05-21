import React, { Fragment } from "react";
import { Text, View, StyleSheet } from "@react-pdf/renderer";
import { money } from "../../../../services/helpers/functions";

const borderColor = "#028910";
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    borderBottomColor: "#028910",
    borderBottomWidth: 1,
    alignItems: "center",
    fontStyle: "bold",
    textTransform: "uppercase",
  },
  beneficiary: {
    width: "25%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "left",
  },
  amount: {
    width: "20%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "left",
  },
  head: {
    width: "15%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "center",
  },
  purpose: {
    width: "40%",
    borderRightColor: borderColor,
    borderRightWidth: 1,
    fontSize: 9,
    padding: 5,
    textAlign: "left",
  },
});

const ExpenditureRow = ({ items }) => {
  const rows = items.map((item, i) => (
    <View style={styles.row} key={i}>
      <Text style={styles.beneficiary}>{item?.beneficiary}</Text>
      <Text style={styles.amount}>{money(item?.amount)}</Text>
      <Text style={styles.head}>{item?.budgetHeadName}</Text>
      <Text style={styles.purpose}>{item?.description}</Text>
    </View>
  ));

  return <Fragment>{rows}</Fragment>;
};

export default ExpenditureRow;

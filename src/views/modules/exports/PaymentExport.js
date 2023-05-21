import React, { useEffect, useState } from "react";
import logo from "../../../assets/images/logo/logo-small.png";
import {
  PDFViewer,
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { useLocation } from "react-router-dom";
import ExpenditureTable from "./expenses/ExpenditureTable";

const bgColor = "#028910";
const styles = StyleSheet.create({
  viewer: {
    width: "100%",
    height: 680,
  },
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  title: {
    textAlign: "center",
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
  },
  section: {
    padding: "10px 20px",
  },
  gridView: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },
  gridViewL: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  gridElements: {
    width: "50%",
    fontSize: 11,
    letterSpacing: 1,
  },
  gridElementsL: {
    width: "50%",
    fontSize: 11,
    letterSpacing: 1,
    textAlign: "right",
  },
  signings: {
    marginTop: 20,
  },
  topLogo: {
    width: "12%",
    margin: "0 auto",
  },
  pymt: {
    fontSize: 11,
    textTransform: "uppercase",
    color: "#e74c3c",
    letterSpacing: 2,
    fontWeight: 700,
  },
  detailWrapper: {
    padding: "0 20px",
  },
  btchC: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "rgba(0,0,0,0.6)",
  },
  btchL: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "rgba(0,0,0,0.7)",
    width: "40%",
    padding: "5px 0",
  },
  btch: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "rgba(0,0,0,0.7)",
  },
  corner: {
    border: "0.55px solid #000",
    width: "60%",
    padding: "5px 8px",
  },
  claimId: {
    fontSize: 12,
    marginTop: 40,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  titleBlock: {
    padding: "5px 10px",
    margin: "0 10px",
  },
  subTitle: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 5,
    color: "#028910",
  },
  claimHeader: {
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: 700,
  },
  toWords: {
    padding: "5px 10px",
    margin: 10,
  },
  toWordsText: {
    fontSize: 11,
    textTransform: "uppercase",
    fontWeight: "bold",
    borderBottom: "1px solid #028910",
    paddingBottom: 5,
    marginBottom: 50,
    textAlign: "center",
    fontFamily: "Montserrat",
  },
  approval: {
    padding: "8px 12px",
    backgroundColor: bgColor,
    textTransform: "uppercase",
    color: "#fff",
    letterSpacing: 3,
    fontSize: 12,
  },
  signatories: {
    padding: "5px 10px",
    flexDirection: "row",
    justifyContent: "space-between",
    textTransform: "uppercase",
    fontSize: 11,
    marginBottom: 15,
  },
  signs: {
    textAlign: "center",
    margin: "0 auto",
    width: "30%",
    fontWeight: 500,
  },
  textAbove: {
    padding: 7,
    fontWeight: 700,
  },
  totalAmount: {
    padding: 8,
    border: "1px solid #555",
    fontSize: 14,
    textAlign: "center",
  },
  emptyset: {
    padding: 13,
  },
  textBelow: {
    padding: 7,
    borderTop: "1px solid #1d1d1d",
  },
  bgImage: {
    position: "absolute",
    minWidth: "100%",
    display: "block",
    width: "100%",
    opacity: 0.09,
    top: 90,
  },
  footer: {
    padding: "10px 20px",
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
  },
});

const PaymentExport = () => {
  const { state } = useLocation();

  const [payment, setPayment] = useState(null);
  const [expenses, setExpenses] = useState([]);

  console.log(payment, expenses);

  useEffect(() => {
    if (state && state?.payment) {
      const { payment } = state;

      setPayment(payment);
      setExpenses(payment?.expenditures);
    }
  }, [state]);

  return (
    <>
      <PDFViewer style={styles.viewer}>
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <Image src={logo} style={styles.topLogo} />
            </View>
            <View style={styles.section}>
              <Text style={styles.title}>
                NCDMB Cooperative Payment Mandate
              </Text>
            </View>
            <View style={styles.section}>
              <ExpenditureTable expenditures={expenses} />
            </View>

            <Image src={logo} style={styles.bgImage} />
          </Page>
        </Document>
      </PDFViewer>
    </>
  );
};

export default PaymentExport;

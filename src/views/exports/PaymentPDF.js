import React from "react";
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({});

const PaymentPDF = () => {
  <Document>
    <Page>
      <Text></Text>
      <Image />

      <Text
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>;
};

export default PaymentPDF;

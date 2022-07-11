import logo from "../../../assets/images/logo/logo-small.png";
import { money } from "../../../services/helpers/functions";
import * as Icon from "react-feather";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const styles = {
  printArea: {
    width: 798,
  },
  wrapper: {
    marginTop: 35,
    fontFamily: "Albert Sans",
  },
  logo: {
    width: "7.5%",
    float: "left",
  },
  details: {
    marginTop: 8,
    border: "1px solid #222",
    padding: 10,
    textAlign: "center",
    float: "right",
    h5: {
      textTransform: "uppercase",
      marginBottom: 0,
      fontSize: 11,
    },
  },
  header: {
    float: "left",
    marginLeft: 5,
    marginTop: 8,
    h1: {
      fontWeight: 600,
      letterSpacing: 0,
      color: "#27ae60",
      fontSize: 32,
      marginBottom: 0,
    },
    h5: {
      fontSize: 9,
      letterSpacing: 0,
    },
  },
  clearfix: {
    clear: "both",
  },
  title: {
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: 25,
    padding: 10,
    border: "1px solid #222",
    backgroundColor: "#2c3e50",
    h3: {
      fontSize: 12,
      fontWeight: 600,
      letterSpacing: 10,
      marginBottom: 0,
      color: "#ecf0f1",
    },
  },
  footer: {
    border: "1px solid #222",
    textAlign: "center",
    marginBottom: 25,
    padding: 10,
    h2: {
      marginBottom: 0,
      fontSize: 16,
    },
  },
  signatories: {
    lineHeight: 5,
    marginTop: 15,
    lines: {
      marginBottom: 15,
    },
    h4: {
      textTransform: "uppercase",
      fontSize: 12,
    },
  },
};

const Mandate = ({ batch, onClose }) => {
  const printMandate = () => {
    const input = document.getElementById("printSection");

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 0, 0);
      pdf.save(batch?.batch_no + ".pdf");
    });
  };

  return (
    <>
      <div className="btn-group btn-rounded mb-5">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => onClose()}
        >
          <Icon.CameraOff size={16} style={{ marginRight: 9 }} />
          Close
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => printMandate()}
        >
          <Icon.Printer size={16} style={{ marginRight: 9 }} />
          Print Mandate
        </button>
      </div>
      <div id="printSection" style={styles.printArea}>
        <div className="brand">
          <img
            src={logo}
            alt="website logo"
            style={styles.logo}
            className="img-fluid"
          />
          <div className="header" style={styles.header}>
            <h1 style={styles.header.h1}>NCDMB STAFF</h1>
            <h5 style={styles.header.h5}>
              MULTI-PURPOSE COOPERATIVE SOCIETY LIMITED
            </h5>
          </div>
          <div className="batchDetails" style={styles.details}>
            <h5 style={styles.details.h5}>
              <strong>Batch No.:</strong> {batch?.batch_no}
            </h5>
          </div>
          <div className="clearfix" style={styles.clearfix}></div>
        </div>
        <section className="title mb-4" style={styles.title}>
          <h3 style={styles.title.h3}>{batch?.payment_type} Mandate</h3>
        </section>
        <table className="table table-bordered table-striped mb-5">
          <thead>
            <tr>
              <th>S/N</th>
              <th>ACCOUNT CODE</th>
              <th>BENEFICIARY</th>
              <th>BUDGET CODE</th>
              <th>AMOUNT</th>
            </tr>
          </thead>
          <tbody>
            {batch?.expenditures?.length > 0 ? (
              batch?.expenditures?.map((exp) => (
                <tr key={exp?.id}>
                  <td>{exp?.id}</td>
                  <td>{exp?.chartOfAccountCode}</td>
                  <td>{exp?.beneficiary}</td>
                  <td>{exp?.budgetHeadCode}</td>
                  <td>{money(exp?.amount)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-danger">
                  NO DATA FOUND!!
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="total-amount mb-4" style={styles.footer}>
          <h3 style={styles.footer.h2}>AMOUNT DUE: {money(batch?.amount)}</h3>
        </div>
        <div className="signatories mt-4" style={styles.signatories}>
          <div className="row">
            <div className="col-md-7" style={styles.signatories.lines}>
              <h4 style={styles.signatories.h4}>
                Treasurer:
                ................................................................................
              </h4>
            </div>
            <div className="col-md-5" style={styles.signatories.lines}>
              <h4 style={styles.signatories.h4}>
                Sign/Date: .................................................
              </h4>
            </div>
            <div className="col-md-7" style={styles.signatories.lines}>
              <h4 style={styles.signatories.h4}>
                Secretary:
                ................................................................................
              </h4>
            </div>
            <div className="col-md-5" style={styles.signatories.lines}>
              <h4 style={styles.signatories.h4}>
                Sign/Date: .................................................
              </h4>
            </div>
            <div className="col-md-7" style={styles.signatories.lines}>
              <h4 style={styles.signatories.h4}>
                President:
                ................................................................................
              </h4>
            </div>
            <div className="col-md-5" style={styles.signatories.lines}>
              <h4 style={styles.signatories.h4}>
                Sign/Date: .................................................
              </h4>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Mandate;

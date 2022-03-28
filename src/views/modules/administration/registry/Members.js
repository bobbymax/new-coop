import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection } from "../../../../services/requests/controllers";
import TableCard from "../../../../theme/components/tables/TableCard";

const Members = () => {
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();

  const columns = [
    { key: "membership_no", label: "Membership Number" },
    { key: "firstname", label: "Firstname" },
    { key: "surname", label: "Surname" },
    { key: "email", label: "Email" },
    { key: "type", label: "Type" },
  ];

  const manageMemberRecord = (data) => {
    navigate(`/members/${data.id}/manage`, {
      state: {
        member: data,
      },
    });
  };

  useEffect(() => {
    try {
      collection("members")
        .then((res) => {
          const data = res.data.data;

          setMembers(data);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <TableCard
            columns={columns}
            rows={members}
            manageMember={manageMemberRecord}
          />
        </div>
      </div>
    </>
  );
};

export default Members;

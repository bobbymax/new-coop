import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useCollection from "../../../../app/Hooks/useCollection";
import TableCard from "../../../../theme/components/tables/TableCard";

const Members = () => {
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();

  const params = {
    url: "members",
    uris: [],
  };

  const data = useCollection(params);

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
    const { collections, error } = data;

    if (error === "") {
      setMembers(collections);
    }
  }, [data]);

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

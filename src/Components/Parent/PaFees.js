import React, { useEffect } from "react";
import BackButton from "../../SharedComponents/BackButton";
import FeeDetails from "../Principal/Finance/Earning/FeeDetails";
import AdmissionFeesView from "../Principal/Finance/Earning/AdmissionFeesView";
import PaymentsView from "../Principal/Finance/Earning/PaymentsView";

const PaFees = () => {

  useEffect(() => { }, []);

  return (
    <>
      <BackButton />
      <div className="d-flex flex-column gap-4 mt-3">
        <PaymentsView />
        <AdmissionFeesView />
        <FeeDetails isParentView={true} />
      </div>
    </>
  );
};

export default PaFees;

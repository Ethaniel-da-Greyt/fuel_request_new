import { error } from "console";
import React, { createContext, ReactNode, useContext } from "react";
import toast from "react-hot-toast";

interface ReqResponse {
  error?: string;
  message?: string;
}

interface FuelProviderType {
  makeRequest: (
    requestor_id: string,
    requestor_name: string,
    requestor_office: string,
    requestor_head_office: string,
    plate_no: string,
    vehicle: string,
    fuel_type: string
  ) => Promise<ReqResponse>;

  cancel: (request_id: string) => Promise<ReqResponse>;

  reject: (request_id: string) => Promise<ReqResponse>;

  deleteRequest: (request_id: string) => Promise<ReqResponse>;

  approveRequest: (request_id: string) => Promise<ReqResponse>;

  updateRequest: (
    request_id: string | "",
    requestor_name: string | "",
    requestor_office: string | "",
    requestor_head_office: string | "",
    plate_no: string | "",
    vehicle: string | "",
    fuel_type: string | ""
  ) => Promise<ReqResponse>;
}

const FuelContext = createContext<FuelProviderType | undefined>(undefined);

const make = `${process.env.NEXT_PUBLIC_APP_URL}/add`;
const updateApi = `${process.env.NEXT_PUBLIC_APP_URL}/update/`;
const deleteApi = `${process.env.NEXT_PUBLIC_APP_URL}/delete/`;
const approveApi = `${process.env.NEXT_PUBLIC_APP_URL}/approve/`;
const cancelApi = `${process.env.NEXT_PUBLIC_APP_URL}/cancel/`;

export const FuelProvider = ({ children }: { children: ReactNode }) => {
  // Make a Request
  const makeRequest = async (
    requestor_id: string,
    requestor_name: string,
    requestor_office: string,
    requestor_head_office: string,
    plate_no: string,
    vehicle: string,
    fuel_type: string
  ) => {
    const makeReq = await fetch(make, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        requestor_id,
        requestor_name,
        requestor_office,
        requestor_head_office,
        plate_no,
        vehicle,
        fuel_type,
      }),
    });

    const res = await makeReq.json();
    if (!makeReq.ok) {
      return { error: res?.error, message: res?.message };
    }

    toast.success("Request Submitted Successfully!");

    return { ...res, error: res?.error, message: res?.message };
  };

  //cancel Request
  const cancel = async (request_id: string) => {
    const canc = await fetch(cancelApi + request_id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const resp = await canc.json();
    if (!canc.ok) {
      return { error: resp?.error, message: resp?.message };
    }

    toast.success("Request Canceled Successfully");
    return { ...resp, error: resp?.error, message: resp?.message };
  };

  const deleteRequest = async (request_id: string) => {
    const res = await fetch(deleteApi + request_id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const response = await res.json();
    if (!res.ok) {
      toast.error("Error: ", response?.message);
      return {
        ...response,
        error: response?.error,
        message: response?.message,
      };
    }

    toast.success("Request Deleted Successfully!");
  };

  const approveRequest = async (request_id: string) => {
    const resp = await fetch(approveApi + request_id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const res = await resp.json();
    if (!resp.ok) {
      toast.error("Error Occured", res?.error);
      return { ...res, error: res?.error, message: res?.message };
    }

    toast.success("Request Approved Successfully!");
    return { ...res, error: res?.error, message: res?.message };
  };

  //Reject Request
  const reject = async (id: string) => {
    try {
      const rejects = await fetch(`${updateApi}/` + id);

      if (!rejects.ok) {
        console.log("Fail to Approve");
      }
      const resp = await rejects.json();

      if (!rejects.ok) {
        toast.error("Error: ", resp?.error);
      }

      toast.success("Request Rejected Successfully!");

      return { ...resp, error: resp?.error, message: resp?.message };
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const updateRequest = async (
    request_id: string,
    requestor_name: string,
    requestor_office: string,
    requestor_head_office: string,
    plate_no: string,
    vehicle: string,
    fuel_type: string
  ) => {
    const updt = await fetch(updateApi + request_id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        requestor_name,
        requestor_office,
        requestor_head_office,
        plate_no,
        vehicle,
        fuel_type,
      }),
    });

    const res = await updt.json();

    if (!updt.ok) {
      return { ...res, error: res?.error, message: res?.message };
    }

    toast.success("Request Updated Successfully");
  };

  return (
    <FuelContext.Provider
      value={{
        makeRequest,
        cancel,
        reject,
        updateRequest,
        deleteRequest,
        approveRequest,
      }}
    >
      {children}
    </FuelContext.Provider>
  );
};

export const useFuel = () => {
  const context = useContext(FuelContext);
  if (!context) {
    throw new Error("useFuel must be used within FuelProvider");
  }

  return context;
};

export default FuelContext;

import React, { createContext, ReactNode, useContext } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

interface ReqResponse {
  success: boolean;
  error?: string | null;
  message?: string | null;
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

  resubmitRequest: (request_id: string) => Promise<ReqResponse>;

  ucfirst: (key: string) => string;

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
const resubmitApi = `${process.env.NEXT_PUBLIC_APP_URL}/resubmit/`;
const deleteApi = `${process.env.NEXT_PUBLIC_APP_URL}/delete/`;
const rejectApi = `${process.env.NEXT_PUBLIC_APP_URL}/reject/`;
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
    const sweet = await Swal.fire({
      title: "Are you sure?",
      text: "To undo this action just click the resubmit button.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Proceed",
      cancelButtonText: "Cancel",
    });

    if (!sweet.isConfirmed) {
      return { success: false, message: "cancel" };
    }

    try {
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
        toast.error(`Error: ${resp?.error}`);
        return { error: resp?.error, message: resp?.message };
      }

      Swal.fire("Canceled!", "Request Canceled", "success");
      toast.success("Request Canceled Successfully");
      return { ...resp, error: resp?.error, message: resp?.message };
    } catch (error) {
      return {
        success: false,
        messsage: "Network Error",
        error: (error as Error).message,
      };
    }
  };

  //Resubmit Request
  const resubmitRequest = async (request_id: string) => {
    const sweetalert = await Swal.fire({
      title: "Are you sure?",
      text: "To undo this action just cancel the request.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Resubmit Request",
      cancelButtonText: "No, Cancel!",
    });

    if (!sweetalert.isConfirmed) {
      return { success: false, message: "canceled" };
    }

    try {
      const res = await fetch(resubmitApi + request_id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const resp = await res.json();

      if (!res.ok) {
        toast.error(`Error: ${resp?.error}`);
        return { success: false, message: resp?.message };
      }

      Swal.fire("Resubmit!", "Request Resubmitted!", "success");
      return { success: true, message: "Request Resubmit" };
    } catch (error) {
      return {
        success: false,
        message: "Network Error",
        error: (error as Error).message,
      };
    }
  };

  //Delete Request
  const deleteRequest = async (request_id: string): Promise<ReqResponse> => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (!result.isConfirmed) {
      return { success: false, message: "Cancelled by user" };
    }

    try {
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
        toast.error(`Error: ${response?.message}`);
        return {
          success: false,
          message: response?.message || "Failed",
          error: response?.error,
        };
      }

      Swal.fire("Deleted!", "Your item has been removed.", "success");
      toast.success("Request Deleted Successfully!");

      return { success: true, message: "Deleted successfully" };
    } catch (error) {
      return {
        success: false,
        message: "Network error",
        error: (error as Error).message,
      };
    }
  };

  //UcFirst Function
  const ucfirst = (key: string) => {
    if (!key) return "";

    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  //Approve
  const approveRequest = async (request_id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      returnFocus: false,
      showCancelButton: true,
      confirmButtonText: "Yes, Approve it!",
      cancelButtonText: "No, cancel!",
    });

    if (!result.isConfirmed) {
      return { success: false, message: "Cancelled by user" };
    }

    try {
      const resp = await fetch(approveApi + request_id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const response = await resp.json();

      if (!resp.ok) {
        toast.error(`Error: ${response?.message}`);
        return {
          success: false,
          message: response?.message || "Failed",
          error: response?.error,
        };
      }

      Swal.fire("Approved!", "Request has been approved.", "success");
      toast.success("Request Approved!");

      return { success: true, message: "Approved successfully" };
    } catch (error) {
      return {
        success: false,
        message: "Network error",
        error: (error as Error).message,
      };
    }
  };

  //Reject Request
  const reject = async (id: string) => {
    const res = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Reject it!",
      cancelButtonText: "No, cancel!",
    });

    if (!res.isConfirmed) {
      return { success: false, message: "canceled" };
    }

    try {
      const response = await fetch(rejectApi + id, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const resp = await response.json();

      if (!response.ok) {
        toast.error(`Error: ${resp?.message}`);
        return { success: true, error: resp?.error, message: resp?.message };
      }
      toast.success("Request Rejected Successfully!");
      Swal.fire("Rejected!", "Request rejected.", "success");
      return { ...resp, error: resp?.error, message: resp?.message };
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  //Update Request
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
      console.log(res);
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
        resubmitRequest,
        ucfirst,
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

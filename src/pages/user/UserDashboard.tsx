import Layout from "@/components/Layout";
import Modal from "@/components/Modal";
import { useFuel } from "@/context/FuelRequestContext";
import { Request } from "@/types/Request";
import { TrashIcon } from "@heroicons/react/16/solid";
import React, { FormEvent, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";

const view = `${process.env.NEXT_PUBLIC_APP_URL}/getRecords`;

const UserDashboard = () => {
  const [req, setReq] = useState({
    requestor_name: "",
    requestor_office: "",
    requestor_head_office: "",
    plate_no: "",
    vehicle: "",
    fuel_type: "",
  });

  const [update, setUpdate] = useState({
    request_id: "",
    requestor_name: "",
    requestor_office: "",
    requestor_head_office: "",
    plate_no: "",
    vehicle: "",
    fuel_type: "",
  });

  const {
    makeRequest,
    cancel,
    updateRequest,
    deleteRequest,
    ucfirst,
    resubmitRequest,
  } = useFuel();

  const handleUpdate = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updateRequest(
      update.request_id,
      update.requestor_name,
      update.requestor_office,
      update.requestor_head_office,
      update.plate_no,
      update.vehicle,
      update.fuel_type
    );
  };

  const [records, setRecords] = useState<Request[]>([]);

  //View Requests
  const viewRequest = useCallback(async () => {
    const res = await fetch(view, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!res.ok) {
      console.log("Error: ", res);
    }
    const data = await res.json();

    console.log(data);
    setRecords(data.data);

    return;
  }, []);

  //Cancel
  const cancelbtn = async (id: string) => {
    cancel(id);
    viewRequest();
  };

  const handleDelete = async (id: string) => {
    deleteRequest(id);
    viewRequest();
  };

  const badger = (status: string) => {
    switch (status) {
      case "approve":
        return "badge-success";
        break;
      case "reject":
        return "badge-error";
        break;
      case "pending":
        return "badge-warning";
        break;
      case "canceled":
        return "badge-neutral";
        break;
      default:
        return "";
        break;
    }
  };

  useEffect(() => {
    // const tokenId = localStorage.getItem("token");

    // // if (tokenId) {
    // //   setUpdate((prev) => ({ ...prev, requestor_id: tokenId }));
    // // }
    viewRequest();
  }, [viewRequest]);

  const makereq = useCallback(async () => {
    try {
      const makeReqst = makeRequest(
        localStorage.getItem("id") || "",
        req.requestor_name,
        req.requestor_office,
        req.requestor_head_office,
        req.plate_no,
        req.vehicle,
        req.fuel_type
      );

      if ((await makeReqst).error) {
        toast.error(`Error: ${(await makeReqst).message}`);
      }
    } catch (error) {
      console.log("Error: ", error);
    }
    viewRequest();
  }, [
    makeRequest,
    req.fuel_type,
    req.plate_no,
    req.requestor_head_office,
    req.requestor_name,
    req.requestor_office,
    req.vehicle,
    viewRequest,
  ]);

  const handleReq = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    makereq();
  };

  return (
    <Layout>
      <div>
        <div className="flex p-5 justify-between items-center rounded m-2 shadow">
          <div className="">
            <p className="font-semibold text-2xl">Previous Requests</p>
          </div>
          <div className="">
            <Modal
              buttonLabel="Make Request"
              title="Make Request"
              className="btn btn-primary rounded"
              id=""
            >
              <form onSubmit={handleReq}>
                <div className="p-3">
                  <div className="mb-2">
                    <label htmlFor="" className="label">
                      Requestor Name
                    </label>
                    <input
                      type="text"
                      value={req.requestor_name}
                      onChange={(e) =>
                        setReq({ ...req, requestor_name: e.target.value })
                      }
                      className="input w-full focus:outline-none"
                      placeholder="Your Name"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="" className="label">
                      Office
                    </label>
                    <input
                      type="text"
                      value={req.requestor_office}
                      onChange={(e) =>
                        setReq({ ...req, requestor_office: e.target.value })
                      }
                      className="input w-full focus:outline-none"
                      placeholder="Requestor's Office"
                      required
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="" className="label">
                      Office Head
                    </label>
                    <input
                      type="text"
                      value={req.requestor_head_office}
                      onChange={(e) =>
                        setReq({
                          ...req,
                          requestor_head_office: e.target.value,
                        })
                      }
                      placeholder="Head Office"
                      required
                      className="input w-full focus:outline-none"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="" className="label">
                      Plate #
                    </label>
                    <input
                      type="text"
                      required
                      value={req.plate_no}
                      onChange={(e) =>
                        setReq({ ...req, plate_no: e.target.value })
                      }
                      placeholder="Plate # ex.: AE45OS"
                      className="input w-full focus:outline-none"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="" className="label">
                      Vehicle
                    </label>
                    <input
                      type="text"
                      value={req.vehicle}
                      onChange={(e) =>
                        setReq({ ...req, vehicle: e.target.value })
                      }
                      required
                      placeholder="Ex. Bongo"
                      className="input w-full focus:outline-none"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="" className="label">
                      Fuel Type
                    </label>
                    <select
                      value={req.fuel_type}
                      onChange={(e) =>
                        setReq({ ...req, fuel_type: e.target.value })
                      }
                      className="select w-full active:outline-none focus:outline-none"
                    >
                      <option value="Special">Special</option>
                      <option value="Unleaded">Unleaded</option>
                      <option value="Diesel">Diesel</option>
                    </select>
                  </div>
                  <div className="mt-3 flex justify-end items-end">
                    <button className="btn btn-success rounded">Submit</button>
                  </div>
                </div>
              </form>
            </Modal>
          </div>
        </div>
        <div className="">
          <div className="flex justify-center m-4">
            <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100 w-full shadow">
              <table className="table text-center">
                <thead>
                  <tr>
                    <th>Request #</th>
                    <th>Date Requested</th>
                    <th>Requestor</th>
                    <th>Office</th>
                    <th>Fuel Type</th>
                    <th>Status</th>
                    <th className="text-start">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {records &&
                    records.map((d) => (
                      <tr key={d.id}>
                        <td>{d.request_id}</td>
                        <td>{d.formatted_date}</td>
                        <td>{d.requestor_name}</td>
                        <td>{d.requestor_office}</td>
                        <td>{d.fuel_type}</td>
                        <td>
                          <span
                            className={`badge ${badger(
                              d.status
                            )} text-white font-semibold`}
                          >
                            {ucfirst(d.status)}
                          </span>
                        </td>
                        <td>
                          <div className="flex items-center justify-start gap-2">
                            <Modal
                              buttonLabel="View"
                              id={d.id}
                              title={d.request_id}
                              className="btn btn-info rounded btn-sm"
                            >
                              <table className="table-auto w-full text-sm flex justify-center">
                                <tbody>
                                  <tr className="border-0">
                                    <td className="font-semibold text-left py-1 w-1/3">
                                      Office:
                                    </td>
                                    <td className="text-left py-1">
                                      {d.requestor_office}
                                    </td>
                                  </tr>
                                  <tr className="border-0">
                                    <td className="font-semibold text-left py-1">
                                      Office Head:
                                    </td>
                                    <td className="text-left py-1">
                                      {d.requestor_head_office}
                                    </td>
                                  </tr>
                                  <tr className="border-0">
                                    <td className="font-semibold text-left py-1">
                                      Requestor:
                                    </td>
                                    <td className="text-left py-1">
                                      {d.requestor_name}
                                    </td>
                                  </tr>
                                  <tr className="border-0">
                                    <td className="font-semibold text-left py-1">
                                      Vehicle:
                                    </td>
                                    <td className="text-left py-1">
                                      {d.vehicle}
                                    </td>
                                  </tr>
                                  <tr className="border-0">
                                    <td className="font-semibold text-left py-1">
                                      Plate #:
                                    </td>
                                    <td className="text-left py-1">
                                      {d.plate_no}
                                    </td>
                                  </tr>
                                  <tr className="border-0">
                                    <td className="font-semibold text-left py-1">
                                      Fuel Type:
                                    </td>
                                    <td className="text-left py-1">
                                      {d.fuel_type}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <div className="modal-action">
                                <div className="flex gap-2">
                                  {d.status == "pending" ? (
                                    <></>
                                  ) : d.status == "canceled" ? (
                                    <>
                                      <Modal
                                        onClick={() =>
                                          setUpdate({
                                            request_id: d.request_id,
                                            requestor_name: d.requestor_name,
                                            requestor_office:
                                              d.requestor_office,
                                            requestor_head_office:
                                              d.requestor_head_office,
                                            plate_no: d.plate_no,
                                            vehicle: d.vehicle,
                                            fuel_type: d.fuel_type,
                                          })
                                        }
                                        buttonLabel="Update"
                                        title="Update Request"
                                        id={`update${d.id}`}
                                        className="btn btn-primary rounded"
                                      >
                                        <form
                                          className="text-left"
                                          onSubmit={(e) => handleUpdate(e)}
                                        >
                                          <div className="p-3">
                                            <div className="mb-2">
                                              <label
                                                htmlFor=""
                                                className="label"
                                              >
                                                Requestor Name
                                              </label>
                                              <input
                                                type="hidden"
                                                value={update.request_id}
                                                onChange={(e) =>
                                                  setUpdate({
                                                    ...update,
                                                    request_id: e.target.value,
                                                  })
                                                }
                                              />
                                              <input
                                                type="text"
                                                value={update.requestor_name}
                                                onChange={(e) =>
                                                  setUpdate({
                                                    ...update,
                                                    requestor_name:
                                                      e.target.value,
                                                  })
                                                }
                                                className="input w-full focus:outline-none"
                                                placeholder="Your Name"
                                                required
                                              />
                                            </div>
                                            <div className="mb-2">
                                              <label
                                                htmlFor=""
                                                className="label"
                                              >
                                                Office
                                              </label>
                                              <input
                                                type="text"
                                                value={update.requestor_office}
                                                onChange={(e) =>
                                                  setUpdate({
                                                    ...update,
                                                    requestor_office:
                                                      e.target.value,
                                                  })
                                                }
                                                className="input w-full focus:outline-none"
                                                placeholder="Requestor's Office"
                                                required
                                              />
                                            </div>
                                            <div className="mb-2">
                                              <label
                                                htmlFor=""
                                                className="label"
                                              >
                                                Office Head
                                              </label>
                                              <input
                                                type="text"
                                                value={
                                                  update.requestor_head_office
                                                }
                                                onChange={(e) =>
                                                  setUpdate({
                                                    ...update,
                                                    requestor_head_office:
                                                      e.target.value,
                                                  })
                                                }
                                                placeholder="Head Office"
                                                required
                                                className="input w-full focus:outline-none"
                                              />
                                            </div>
                                            <div className="mb-2">
                                              <label
                                                htmlFor=""
                                                className="label"
                                              >
                                                Plate #
                                              </label>
                                              <input
                                                type="text"
                                                required
                                                value={update.plate_no}
                                                onChange={(e) =>
                                                  setUpdate({
                                                    ...update,
                                                    plate_no: e.target.value,
                                                  })
                                                }
                                                placeholder="Plate # ex.: AE45OS"
                                                className="input w-full focus:outline-none"
                                              />
                                            </div>
                                            <div className="mb-2">
                                              <label
                                                htmlFor=""
                                                className="label"
                                              >
                                                Vehicle
                                              </label>
                                              <input
                                                type="text"
                                                value={update.vehicle}
                                                onChange={(e) =>
                                                  setUpdate({
                                                    ...update,
                                                    vehicle: e.target.value,
                                                  })
                                                }
                                                required
                                                placeholder="Ex. Bongo"
                                                className="input w-full focus:outline-none"
                                              />
                                            </div>
                                            <div className="mb-2">
                                              <label
                                                htmlFor=""
                                                className="label"
                                              >
                                                Fuel Type
                                              </label>
                                              <select
                                                value={update.fuel_type}
                                                onChange={(e) =>
                                                  setUpdate({
                                                    ...update,
                                                    fuel_type: e.target.value,
                                                  })
                                                }
                                                className="select w-full active:outline-none focus:outline-none"
                                              >
                                                <option value="Special">
                                                  Special
                                                </option>
                                                <option value="Unleaded">
                                                  Unleaded
                                                </option>
                                                <option value="Diesel">
                                                  Diesel
                                                </option>
                                              </select>
                                            </div>
                                            <div className="mt-3 flex justify-end items-end">
                                              <button className="btn btn-success rounded">
                                                Update Request
                                              </button>
                                            </div>
                                          </div>
                                        </form>
                                      </Modal>

                                      {/*  */}
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                            </Modal>
                            {d.status == "canceled" ? (
                              <>
                                <button
                                  onClick={() => resubmitRequest(d.request_id)}
                                  className="btn btn-warning btn-sm rounded"
                                >
                                  Resubmit
                                </button>
                                <button
                                  onClick={() => handleDelete(d.request_id)}
                                  className="btn btn-error rounded btn-sm"
                                >
                                  <TrashIcon className="size-4 text-white" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => cancel(d.request_id)}
                                  className="btn btn-error btn-sm rounded"
                                >
                                  Cancel
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserDashboard;

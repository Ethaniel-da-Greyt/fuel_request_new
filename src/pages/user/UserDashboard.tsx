import Layout from "@/components/Layout";
import { Request } from "@/types/Request";
import React, { FormEvent, useCallback, useEffect, useState } from "react";

const addreq = `${process.env.NEXT_PUBLIC_APP_URL}/add`;
const updateReq = `${process.env.NEXT_PUBLIC_APP_URL}/update/`;
const cancel = `${process.env.NEXT_PUBLIC_APP_URL}/cancel`;
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
    requestor_name: "",
    requestor_office: "",
    requestor_head_office: "",
    plate_no: "",
    vehicle: "",
    fuel_type: "",
    requestor_id: "",
  });

  const handleUpdate = (e: FormEvent<HTMLFormElement>, id: number) => {
    e.preventDefault();
    updatePro(id);
  };

  const updatePro = async (id: number) => {
    const updt = await fetch(`${updateReq}/` + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(update),
    });

    if (!updt) {
      console.log("Error: ", updt);
    }

    const up = await updt.json();

    viewRequest();
  };

  const [records, setRecords] = useState<Request[]>([]);

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

  const cancelbtn = async (id: number) => {
    const canc = await fetch(`${cancel}/` + id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!canc.ok) {
      console.log("Error: Failed to Cancel", canc.status);
    }

    const canceled = await canc.json();

    alert("Request canceled successfully");

    viewRequest();

    return canceled;
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
    const tokenId = localStorage.getItem("token");

    if (tokenId) {
      setUpdate((prev) => ({ ...prev, requestor_id: tokenId }));
    }
    viewRequest();
  }, [viewRequest]);

  const makeRequest = useCallback(async () => {
    const add = await fetch(addreq, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        requestor_name: req.requestor_name,
        requestor_office: req.requestor_office,
        requestor_head_office: req.requestor_head_office,
        plate_no: req.plate_no,
        vehicle: req.vehicle,
        fuel_type: req.fuel_type,
      }),
    });

    const res = await add.json();

    console.log(res);
    if (!res) {
      console.log("Error occured");
    }

    alert("Request Submitted Successfully");
  }, [req]);

  const handleReq = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    makeRequest();
  };

  return (
    <Layout>
      <div>
        <div className="flex p-5 justify-between items-center rounded m-2 shadow">
          <div className="">
            <p className="font-semibold text-2xl">Previous Requests</p>
          </div>
          <div className="">
            <button
              className="btn btn-primary rounded"
              onClick={() => {
                const addModal = document.getElementById(
                  "addModal"
                ) as HTMLDialogElement;
                addModal?.showModal();
              }}
            >
              Make Request
            </button>
            <dialog id="addModal" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <p className="text-lg">Make Request</p>
                <p className="border-b border-1 mt-2"></p>
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
                      <button className="btn btn-success rounded">
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </dialog>
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
                    <th>Action</th>
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
                            {d.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className="btn btn-info rounded-2xl text-white"
                            onClick={() => {
                              const modal = document.getElementById(
                                `${d.id}`
                              ) as HTMLDialogElement;
                              modal?.showModal();
                            }}
                          >
                            View
                          </button>

                          <dialog id={`${d.id}`} className="modal">
                            <div className="modal-box">
                              <form method="dialog">
                                {/* if there is a button in form, it will close the modal */}
                                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                  ✕
                                </button>
                              </form>
                              <h3 className="font-bold text-lg text-left mb-2">
                                {d.request_id}
                              </h3>
                              <div className=" mb-2 border-b-2"></div>
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
                                    <>
                                      <button
                                        onClick={() => cancelbtn(d.id)}
                                        className="btn btn-warning text-white rounded"
                                      >
                                        Cancel Request
                                      </button>
                                    </>
                                  ) : d.status == "canceled" ? (
                                    <>
                                      <button
                                        onClick={() => {
                                          setUpdate({
                                            requestor_name: d.requestor_name,
                                            requestor_office:
                                              d.requestor_office,
                                            requestor_head_office:
                                              d.requestor_head_office,
                                            plate_no: d.plate_no,
                                            vehicle: d.vehicle,
                                            fuel_type: d.fuel_type,
                                            requestor_id:
                                              localStorage.getItem("token") ||
                                              "",
                                          });
                                          const modal = document.getElementById(
                                            `update${d.id}`
                                          ) as HTMLDialogElement;
                                          modal?.showModal();
                                        }}
                                        className="btn btn-primary rounded"
                                      >
                                        Update
                                      </button>

                                      {/* Update Modal */}
                                      <dialog
                                        id={`update${d.id}`}
                                        className="modal text-left"
                                      >
                                        <div className="modal-box">
                                          <form method="dialog">
                                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                                              ✕
                                            </button>
                                          </form>
                                          <p className="text-lg">
                                            Update Request
                                          </p>
                                          <p className="border-b border-1 mt-2"></p>
                                          <form
                                            onSubmit={(e) =>
                                              handleUpdate(e, d.id)
                                            }
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
                                                  value={
                                                    update.requestor_office
                                                  }
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
                                        </div>
                                      </dialog>

                                      {/*  */}

                                      <button className="btn btn-error rounded">
                                        Remove
                                      </button>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </div>
                            </div>
                          </dialog>
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

import { FormEvent, useCallback, useEffect, useState } from "react";
import Dashboard from "./dashboard";
import { Request } from "@/types/Request";
import { ApiResponse } from "@/types/ApiResponse";
import { useRouter } from "next/router";
import Modal from "@/components/Modal";
import { useFuel } from "@/context/FuelRequestContext";

const getData = `${process.env.NEXT_PUBLIC_APP_URL}/fuel-requests`;
const getApprove = `${process.env.NEXT_PUBLIC_APP_URL}/approve`;
const getReject = `${process.env.NEXT_PUBLIC_APP_URL}/reject`;

const Display = () => {
  const route = useRouter();
  const { reject, approveRequest } = useFuel();
  const [data, setData] = useState<Request[]>([]);
  const [search, setSearch] = useState("");
  const [errmsg, setErrmsg] = useState<ApiResponse>({
    status: 0,
    error: "",
    message: "",
  });

  const request = useCallback(async (search = "") => {
    const res = await fetch(`${getData}?search=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    if (!res.ok) {
      console.log("Fail to Fetch Data");
    }

    const response = await res.json();
    console.log(response.data);

    setData(response.data);
  }, []);

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    request(search);
  };

  const rejectBtn = async (id: string) => {
    try {
      if (await reject(id)) request();
    } catch (error) {
      console.log("Error: ", error);
    }
  };
  const approveBtn = async (r_id: string) => {
    try {
      if (await approveRequest(r_id)) request();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const badger = (status: string) => {
    switch (status) {
      case "approve":
        return "badge-success";
      case "reject":
        return "badge-error";
      case "pending":
        return "badge-warning";
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      route.replace("/");
    }
    const UserRole = localStorage.getItem("role");
    if (UserRole !== "admin") {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      route.replace("/");
    }
    request();
  }, [request, route]);

  return (
    <>
      <Dashboard>
        <div className="rounded-2xl p-4 shadow m-4">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              className="input focus: outline-0"
              placeholder="Search here..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <p className="text-xs textarea-ghost">
              Search Records Here approved, rejected, and pending.
            </p>
          </form>
        </div>
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
                {data &&
                  data.map((d) => (
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
                              <form>
                                <div className="flex gap-2">
                                  {d.status == "pending" ? (
                                    <>
                                      <button
                                        onClick={() => approveBtn(d.id)}
                                        className="btn btn-success text-white rounded-2xl"
                                      >
                                        Approve
                                      </button>
                                      <button
                                        onClick={() => rejectBtn(d.id)}
                                        className="btn btn-error text-white rounded-2xl"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  ) : (
                                    <></>
                                  )}
                                </div>
                              </form>
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
      </Dashboard>
    </>
  );
};

export default Display;

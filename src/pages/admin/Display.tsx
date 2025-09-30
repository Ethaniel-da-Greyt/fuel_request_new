import { FormEvent, useCallback, useEffect, useState } from "react";
import Dashboard from "./dashboard";
import { Request } from "@/types/Request";
// import { useRouter } from "next/router";
import { useFuel } from "@/context/FuelRequestContext";
import Modal from "@/components/Modal";
import { CheckIcon, XMarkIcon } from "@heroicons/react/16/solid";
import { useAuth } from "@/context/AuthContext";

const getData = `${process.env.NEXT_PUBLIC_APP_URL}/fuel-requests`;

const Display = () => {
  // const route = useRouter();
  const { logout } = useAuth();
  const { reject, approveRequest, ucfirst } = useFuel();
  const [data, setData] = useState<Request[]>([]);
  const [search, setSearch] = useState("");

  const request = useCallback(async (search = "") => {
    const res = await fetch(`${getData}?search=${search}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    reject(id);
    request();
  };
  const approveBtn = (r_id: string) => {
    approveRequest(r_id);
    request();
  };

  const badge = (key: string) => {
    switch (key) {
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
      logout();
    }
    const UserRole = localStorage.getItem("role");
    if (UserRole !== "admin") {
      logout();
    }
    request();
  }, [request, logout]);

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
                        {d.status && (
                          <Modal
                            buttonLabel={ucfirst(d.status)}
                            className={`badge ${badge(
                              d.status
                            )} text-white cursor-pointer`}
                            title={d.request_id}
                            id={`view${d.id}`}
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
                              <div className="flex gap-2"></div>
                            </div>
                          </Modal>
                        )}
                      </td>
                      <td>
                        {d.status == "pending" ? (
                          <div className="flex gap-2 justify-center">
                            <span
                              onClick={() => approveBtn(d.id)}
                              className="btn btn-success btn-sm text-white rounded"
                            >
                              <CheckIcon className="size-5 text-white" />
                              Approve
                            </span>
                            <span
                              onClick={() => rejectBtn(d.id)}
                              className="btn btn-error btn-sm text-white rounded"
                            >
                              <XMarkIcon className="size-5 text-white" /> Reject
                            </span>
                          </div>
                        ) : (
                          <>
                            <span className="badge badge-neutral px-5 font-semibold">
                              None
                            </span>
                          </>
                        )}
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

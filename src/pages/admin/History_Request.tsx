import React, { useCallback, useEffect, useState } from "react";
import Dashboard from "./dashboard";
import { Request } from "@/types/Request";
import { useFuel } from "@/context/FuelRequestContext";
import {
  CheckCircleIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/16/solid";

const getData = `${process.env.NEXT_PUBLIC_APP_URL}/fuel-history`;
const History_Request = () => {
  const [data, setData] = useState<Request[]>([]);
  const [search, setSearch] = useState("");
  const { ucfirst, deleteRequest } = useFuel();

  const history = useCallback(async (key = "") => {
    const record = await fetch(`${getData}?search=${key}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (!record.ok) {
      console.log("Error Fetching");
    }

    const rec = await record.json();
    setData(rec.data);
  }, []);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    history(search);
  };

  const handleDelete = (id: string) => {
    deleteRequest(id);
  };

  useEffect(() => {
    history();
  }, [history]);

  const badger = (status: string) => {
    switch (status) {
      case "approve":
        return "text-success";
      case "reject":
        return "text-error";
    }
  };
  return (
    <>
      <Dashboard>
        <div className="rounded-2xl p-4  shadow m-4">
          <form onSubmit={handleSearch}>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              className="input"
              placeholder="Search here..."
            />
            <p className="text-sm text-gray-500">
              Search approved and rejected records here
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
                          className={`flex items-center gap-3 px-1 font-semibold ${badger(
                            d.status
                          )}`}
                        >
                          {d.status == "approve" ? (
                            <>
                              <CheckCircleIcon className="size-4 text-success" />
                              {ucfirst(d.status)}
                            </>
                          ) : (
                            <>
                              <XCircleIcon className="size-4 text-error" />
                              {ucfirst(d.status)}
                            </>
                          )}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-error rounded text-white btn-sm"
                          onClick={() => handleDelete(d.request_id)}
                        >
                          <TrashIcon className="size-4 text-white" />
                          Remove
                        </button>
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

export default History_Request;

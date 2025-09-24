import React, { useCallback, useEffect, useState } from "react";
import Dashboard from "./dashboard";
import { Request } from "@/types/Request";
const getData = `${process.env.NEXT_PUBLIC_APP_URL}/fuel-history`;
const History_Request = () => {
  const [data, setData] = useState<Request[]>([]);

  const history = useCallback(async () => {
    const record = await fetch(getData);

    if (!record.ok) {
      console.log("Error Fetching");
    }

    const rec = await record.json();
    setData(rec.data);
  }, []);

  useEffect(() => {
    history();
  }, [history]);

  const badger = (status: string) => {
    switch (status) {
      case "approve":
        return "badge-success";
      case "reject":
        return "badge-error";
    }
  };
  return (
    <>
      <Dashboard>
        <div className="rounded-2xl p-4  shadow m-4">
          <form>
            <input type="text" className="input" placeholder="Search here..." />
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
                          className={`text-white badge ${badger(d.status)}`}
                        >
                          {d.status}
                        </span>
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

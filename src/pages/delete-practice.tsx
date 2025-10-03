import { Request } from "@/types/Request";
import { TrashIcon } from "@heroicons/react/16/solid";
import { ForwardIcon } from "@heroicons/react/24/solid";
import React, { useEffect, useState } from "react";

const DeletePrac = () => {
  const [ids, setIds] = useState<string[]>([]);
  const [datas, setDatas] = useState<Request[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/fuel-requests-sample`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const res = await response.json();

      if (!response.ok) {
        throw new Error(res?.error || "Fetch error");
      }

      setDatas(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // handle single checkbox
  const handleCheckboxChange = (id: string) => {
    setIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // handle select all
  const handleSelectAll = () => {
    if (selectAll) {
      setIds([]);
    } else {
      setIds(datas.map((d) => d.request_id));
    }
    setSelectAll(!selectAll);
  };

  // handle delete request
  const handleDelete = async () => {
    if (ids.length === 0) {
      alert("No rows selected.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/delete-restore`, // adjust to your Laravel route
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ ids }),
        }
      );

      const res = await response.json();

      if (response.ok) {
        alert(res.message || "Deleted successfully");
        setDatas((prev) => prev.filter((d) => !ids.includes(d.request_id)));
        setIds([]);
        setSelectAll(false);
      } else {
        alert(res.error || "Error deleting");
      }
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div className="m-10 overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th>
              <label>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                />
              </label>
            </th>
            <th>Request ID</th>
            <th>Date Requested</th>
            <th>Requestor</th>
            <th>Office</th>
            <th>Head Office</th>
            <th>Plate #</th>
            <th>Vehicle</th>
            <th>Fuel Type</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {datas &&
            datas.map((d) => (
              <tr key={d.id}>
                <td>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={ids.includes(d.request_id)}
                    onChange={() => handleCheckboxChange(d.request_id)}
                  />
                </td>
                <td>{d.request_id}</td>
                <td>{d.formatted_date}</td>
                <td>{d.requestor_name}</td>
                <td>{d.requestor_office}</td>
                <td>{d.requestor_head_office}</td>
                <td>{d.plate_no}</td>
                <td>{d.vehicle}</td>
                <td>{d.fuel_type}</td>
                <td>{d.status}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className="flex justify-end items-center mt-5">
        <button
          className="btn btn-success rounded flex items-center gap-2"
          onClick={handleDelete}
        >
          <ForwardIcon className="size-5 text-white" /> Restore
        </button>
      </div>
    </div>
  );
};

export default DeletePrac;

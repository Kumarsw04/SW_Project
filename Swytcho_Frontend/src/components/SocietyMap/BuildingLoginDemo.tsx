
import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import BuildingViewer, {
  type AssignedBuilding,
} from "./Building3D/BuildingViewer";
import "./BuildingLoginDemo.css";

interface AssignmentRow {
  username: string;
  building_code: string;
  building_name: string;
}

export default function BuildingLoginDemo() {
  const [username, setUsername] = useState("");
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [assignedBuildings, setAssignedBuildings] =
    useState<AssignedBuilding[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load Excel assignment data
  useEffect(() => {
    async function loadExcel() {
      try {
        const response = await fetch(
          "/swytcho_user_building_assignments.xlsx",
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error("Could not load Excel assignment file.");
        }

        const buffer = await response.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });

        const sheet = workbook.Sheets["UserBuildings"];

        if (!sheet) {
          throw new Error("UserBuildings sheet not found.");
        }

        const rows = XLSX.utils.sheet_to_json<AssignmentRow>(sheet, {
          defval: "",
        });

        setAssignments(rows);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Excel loading failed."
        );
      } finally {
        setLoading(false);
      }
    }

    loadExcel();
  }, []);

  // Find buildings assigned to entered username
  const handleLogin = () => {
    setError("");
    setAssignedBuildings([]);

    const enteredUsername = username.trim().toLowerCase();

    if (!enteredUsername) {
      setError("Please enter a username.");
      return;
    }

    const matchedRows = assignments.filter(
      (row) =>
        String(row.username).trim().toLowerCase() === enteredUsername
    );

    if (matchedRows.length === 0) {
      setError("No buildings assigned to this user.");
      return;
    }

    const validBuildings = matchedRows
      .filter(
        (row) =>
          ["building_1", "building_2"].includes(
            String(row.building_code).trim()
          )
      )
      .map((row) => ({
        building_code: String(row.building_code).trim(),
        building_name: String(row.building_name).trim(),
      }));

    if (validBuildings.length === 0) {
      setError("No supported building codes found for this user.");
      return;
    }

    setAssignedBuildings(validBuildings);
  };

  if (loading) {
    return <p>Loading building assignments...</p>;
  }

  return (
    <section className="building-login-demo">
      <div className="building-login-header">
        <h2>SWYTCHO Building Access</h2>
        <p>Enter your username to view assigned buildings.</p>
      </div>

      <div className="building-login-form">
        <input
          type="text"
          placeholder="Enter username (user1, user2, user3)"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") handleLogin();
          }}
        />

        <button type="button" onClick={handleLogin}>
          View My Buildings
        </button>
      </div>

      {error && <p className="building-login-error">{error}</p>}

      {assignedBuildings.length > 0 && (
        <div className="assigned-building-results">
          <h3>Assigned Buildings</h3>

          <div className="assigned-building-list">
            {assignedBuildings.map((building, index) => (
              <div key={`${building.building_code}-${index}`}>
                {building.building_name}
              </div>
            ))}
          </div>

          <BuildingViewer
            assignedBuildings={assignedBuildings}
          />
        </div>
      )}
    </section>
  );
}

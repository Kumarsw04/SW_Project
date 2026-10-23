
import { useState } from "react";
import { fetchInfluxRecords } from "../lib/influx";

export default function InfluxTest() {
  const [message, setMessage] = useState("Not tested yet");
  const [loading, setLoading] = useState(false);

  async function handleTest() {
    setLoading(true);
    setMessage("Connecting to InfluxDB...");

    try {
      const records = await fetchInfluxRecords();

      console.log("InfluxDB records:", records);
      console.log("Records retrieved:", records.length);
      console.log("Latest record:", records[records.length - 1] ?? null);

      setMessage(
        records.length > 0
          ? `Success! Retrieved ${records.length} records from InfluxDB.`
          : "Connected, but no matching records were returned."
      );
    } catch (error) {
      console.error("InfluxDB connection error:", error);

      setMessage(
        error instanceof Error
          ? error.message
          : "Unknown connection error"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section style={{ padding: 20 }}>
      <h2>InfluxDB Connection Test</h2>

      <button onClick={handleTest} disabled={loading}>
        {loading ? "Testing..." : "Test InfluxDB Connection"}
      </button>

      <p>{message}</p>
    </section>
  );
}


const url = import.meta.env.VITE_INFLUX_URL;
const org = import.meta.env.VITE_INFLUX_ORG;
const bucket = import.meta.env.VITE_INFLUX_BUCKET;
const token = import.meta.env.VITE_INFLUX_TOKEN;

export interface InfluxRecord {
  _time: string;
  _measurement: string;
  device_id: string;
  channel_id: string;
  channel_role: string;
  supply_source: string;

  // Dashboard-compatible properties
  active_power_kw?: number;
  apparent_power_kva?: number;
  voltage_rms_v?: number;
  current_rms_a?: number;
  frequency_hz?: number;
  power_factor?: number;
  reactive_power_kvar?: number;
  import_energy_kwh?: number;
  export_energy_kwh?: number;
  enclosure_temperature_c?: number;
  measurement_valid?: boolean;

  // Actual InfluxDB power fields
  active_power_a_kw?: number;
  active_power_b_kw?: number;
  active_power_c_kw?: number;
  total_active_power_kw?: number;

  apparent_power_a_kva?: number;
  apparent_power_b_kva?: number;
  apparent_power_c_kva?: number;
  total_apparent_power_kva?: number;

  [key: string]: string | number | boolean | undefined;
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let value = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (quoted && line[i + 1] === '"') {
        value += '"';
        i++;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(value);
      value = "";
    } else {
      value += char;
    }
  }

  values.push(value);
  return values;
}

export async function fetchInfluxRecords(): Promise<InfluxRecord[]> {
  if (!url || !org || !bucket || !token) {
    throw new Error("Missing InfluxDB environment variables.");
  }

  // Read all fields from the selected measurement.
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -15m)
      |> filter(fn: (r) => r._measurement == "erg_telemetry")
      |> group(columns: [
        "device_id",
        "channel_id",
        "channel_role",
        "_measurement",
        "_field"
      ])
      |> sort(columns: ["_time"], desc: true)
  `;

  const baseUrl = url.replace(/\/+$/, "");

  const response = await fetch(
    `${baseUrl}/api/v2/query?org=${encodeURIComponent(org)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${token}`,
        "Content-Type": "application/vnd.flux",
        Accept: "application/csv",
      },
      body: query,
    }
  );

  if (!response.ok) {
    throw new Error(
      `InfluxDB request failed: ${response.status} ${await response.text()}`
    );
  }

  const csv = await response.text();

  console.log("InfluxDB response length:", csv.length);

  const records = new Map<string, InfluxRecord>();
  let headers: string[] = [];

  for (const line of csv.split(/\r?\n/)) {
    if (!line.trim() || line.startsWith("#")) continue;

    const values = parseCsvLine(line);

    if (values[0] === "" && values[1] === "result") {
      headers = values;
      continue;
    }

    if (!headers.length || values.length !== headers.length) continue;

    const row = Object.fromEntries(
      headers.map((header, index) => [header, values[index]])
    );

    const time = row._time;
    const measurement = row._measurement;
    const field = row._field;
    const rawValue = row._value;

    if (
      typeof time !== "string" ||
      typeof measurement !== "string" ||
      typeof field !== "string" ||
      rawValue === undefined ||
      rawValue === ""
    ) {
      continue;
    }

    const deviceId = String(row.device_id ?? "unknown");
    const channelId = String(row.channel_id ?? "unknown");
    const channelRole = String(row.channel_role ?? "unknown");
    const supplySource = String(row.supply_source ?? "unknown");

    const key = `${deviceId}|${channelId}|${channelRole}|${time}`;

    const record = records.get(key) ?? {
      _time: time,
      _measurement: measurement,
      device_id: deviceId,
      channel_id: channelId,
      channel_role: channelRole,
      supply_source: supplySource,
    };

    // Preserve all available tags and metadata.
    for (const [column, value] of Object.entries(row)) {
      if (
        ![
          "_time",
          "_measurement",
          "_field",
          "_value",
          "result",
          "table",
          "_start",
          "_stop",
        ].includes(column) &&
        value !== undefined &&
        value !== ""
      ) {
        record[column] = value;
      }
    }

    // Preserve numeric, boolean and string field values.
    if (rawValue === "true" || rawValue === "false") {
      record[field] = rawValue === "true";
    } else {
      const numericValue = Number(rawValue);

      record[field] =
        rawValue.trim() !== "" && Number.isFinite(numericValue)
          ? numericValue
          : rawValue;
    }

    // Map actual InfluxDB total measurements to existing dashboard names.
    if (field === "total_active_power_kw") {
      record.active_power_kw = Number(rawValue);
    }

    if (field === "total_apparent_power_kva") {
      record.apparent_power_kva = Number(rawValue);
    }

    records.set(key, record);
  }

  const result = [...records.values()].sort(
    (a, b) => Date.parse(a._time) - Date.parse(b._time)
  );

  console.log("InfluxDB telemetry records:", result.length);

  console.log(
    "Latest InfluxDB timestamp:",
    result.length ? result[result.length - 1]._time : "No records"
  );

  console.log("Latest power readings:", result.slice(-5).map((record) => ({
    time: record._time,
    active_power_kw: record.active_power_kw,
    total_active_power_kw: record.total_active_power_kw,
    apparent_power_kva: record.apparent_power_kva,
    total_apparent_power_kva: record.total_apparent_power_kva,
  })));

  return result;
}

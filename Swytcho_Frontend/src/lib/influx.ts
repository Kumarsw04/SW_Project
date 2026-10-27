
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

  const fields = [
    "active_power_kw",
    "apparent_power_kva",
    "voltage_rms_v",
    "current_rms_a",
    "frequency_hz",
    "power_factor",
    "reactive_power_kvar",
    "import_energy_kwh",
    "export_energy_kwh",
    "enclosure_temperature_c",
    "measurement_valid",
  ];
  
  
  const query = `
    from(bucket: "${bucket}")
    |> range(start: -15m)
    |> filter(fn: (r) => r._measurement == "erg_telemetry")
    |> filter(fn: (r) =>
      r._field == "active_power_kw" or
      r._field == "apparent_power_kva" or
      r._field == "voltage_rms_v" or
      r._field == "current_rms_a" or
      r._field == "frequency_hz" or
      r._field == "power_factor" or
      r._field == "reactive_power_kvar" or
      r._field == "import_energy_kwh" or
      r._field == "export_energy_kwh" or
      r._field == "enclosure_temperature_c" or
      r._field == "measurement_valid"
    )
    |> group(columns: ["device_id", "channel_id", "channel_role", "_measurement", "_field"])
    |> sort(columns: ["_time"], desc: true)
    |> limit(n: 100)
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
  console.log("InfluxDB raw response:", JSON.stringify(csv));
  console.log("InfluxDB response length:", csv.length);

  const records = new Map<string, InfluxRecord>();
  let headers: string[] = [];

  for (const line of csv.split(/\r?\n/)) {
    if (!line.trim() || line.startsWith("#")) continue;

    const values = parseCsvLine(line);

    // InfluxDB CSV responses can contain a header for each result table.
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

    if (field === "measurement_valid") {
      record.measurement_valid = rawValue === "true";
    } else if (fields.includes(field)) {
      const number = Number(rawValue);

      if (Number.isFinite(number)) {
        record[field] = number;
      }
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

  return result;
}

import zipcodes from "zipcodes";

export function isUSZip(zip: string): boolean {
  return /^\d{5}(-\d{4})?$/.test(zip.trim());
}

export interface USZipResult {
  city: string;
  state: string;
  stateCode: string;
}

export function lookupUSZip(zip: string): USZipResult | null {
  const entry = zipcodes.lookup(zip.substring(0, 5));
  if (!entry) return null;
  const stateNames: Record<string, string> = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
    CO: "Colorado", CT: "Connecticut", DE: "Delaware", DC: "District of Columbia",
    FL: "Florida", GA: "Georgia", GU: "Guam", HI: "Hawaii", ID: "Idaho",
    IL: "Illinois", IN: "Indiana", IA: "Iowa", KS: "Kansas", KY: "Kentucky",
    LA: "Louisiana", ME: "Maine", MD: "Maryland", MA: "Massachusetts", MI: "Michigan",
    MN: "Minnesota", MS: "Mississippi", MO: "Missouri", MT: "Montana", NE: "Nebraska",
    NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", NM: "New Mexico",
    NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
    OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", PR: "Puerto Rico",
    RI: "Rhode Island", SC: "South Carolina", SD: "South Dakota", TN: "Tennessee",
    TX: "Texas", UT: "Utah", VT: "Vermont", VI: "Virgin Islands", VA: "Virginia",
    WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
    AS: "American Samoa", MP: "Northern Mariana Islands", AP: "Armed Forces Pacific",
    AE: "Armed Forces Europe", AA: "Armed Forces Americas",
  };
  return {
    city: entry.city,
    stateCode: entry.state,
    state: stateNames[entry.state] ?? entry.state,
  };
}

interface NominatimAddress {
  house_number?: string;
  road?: string;
  city?: string;
  town?: string;
  village?: string;
  municipality?: string;
  county?: string;
  state?: string;
  region?: string;
  province?: string;
  postcode?: string;
  country?: string;
}

interface NominatimResult {
  display_name: string;
  address?: NominatimAddress;
}

export async function lookupPostalCode(postalCode: string, country?: string): Promise<{ city?: string; state?: string } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postalCode)}${country ? `&country=${encodeURIComponent(country)}` : ""}&format=json&limit=1&addressdetails=1`,
      { headers: { "User-Agent": "EliteLedgerCapital/1.0" } }
    );
    if (!res.ok) return null;
    const data: NominatimResult[] = await res.json();
    if (!data || data.length === 0) return null;
    const addr = data[0]?.address;
    if (!addr) return null;
    return {
      city: addr.city || addr.town || addr.village || addr.municipality || addr.county,
      state: addr.state || addr.region || addr.province,
    };
  } catch {
    return null;
  }
}

export interface AddressSuggestion {
  display: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export async function searchAddress(query: string): Promise<AddressSuggestion[]> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
      { headers: { "User-Agent": "EliteLedgerCapital/1.0" } }
    );
    if (!res.ok) return [];
    const data: NominatimResult[] = await res.json();
    return data
      .filter((item: NominatimResult) => item.address)
      .map((item: NominatimResult): AddressSuggestion => {
        const a = item.address as NominatimAddress;
        const road = [a.house_number, a.road].filter(Boolean).join(" ");
        return {
          display: item.display_name,
          address: road || item.display_name.split(",")[0],
          city: a.city || a.town || a.village || a.municipality || a.county || "",
          state: a.state || a.region || a.province || "",
          zipCode: a.postcode || "",
          country: a.country || "",
        };
      });
  } catch {
    return [];
  }
}

// D1 Client using Cloudflare REST API
const ACCOUNT_ID = "c5ec26eda22903c2898aadecbe94ea98";
const DATABASE_ID = "11cb5f69-c57e-4317-a524-d114efbd4ad4";
const API_TOKEN = "cfat_f9PoI5LwxsfQXds5LrVeJxbaoUJoXQcbU6JNed1Q344f8ce3";

export interface D1Result {
  results: any[];
  meta: any;
  duration: number;
}

export async function query<T = any>(
  sql: string,
  binds: (string | number | null)[] = []
): Promise<D1Result> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${ACCOUNT_ID}/d1/database/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sql: sql.trim(),
        params: binds,
      }),
    }
  );

  const data = await response.json();
  
  if (!response.ok || data.errors?.length) {
    throw new Error(data.errors?.[0]?.message || "D1 query failed");
  }

  return {
    results: data.results?.[0]?.results || [],
    meta: data.results?.[0]?.meta || {},
    duration: data.results?.[0]?.duration || 0,
  };
}
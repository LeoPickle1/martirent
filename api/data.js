const ALLOWED_TYPES = new Set(["maintenance", "contacts", "properties"]);

const getRequestBody = (body) => {
  if (typeof body === "string") return JSON.parse(body);
  return body;
};

module.exports = async function handler(request, response) {
  response.setHeader("Cache-Control", "no-store");

  const type = String(request.query?.type || "");
  if (!ALLOWED_TYPES.has(type)) {
    return response.status(400).json({ error: "Invalid data type" });
  }

  const { get, put } = await import("@vercel/blob");
  const pathname = `martirent/${type}.json`;

  if (request.method === "GET") {
    try {
      const result = await get(pathname, {
        access: "private",
        useCache: false,
      });

      if (!result || result.statusCode === 404 || !result.stream) {
        return response.status(200).json([]);
      }

      const text = await new Response(result.stream).text();
      const data = JSON.parse(text);
      return response.status(200).json(Array.isArray(data) ? data : []);
    } catch (error) {
      if (error?.name === "BlobNotFoundError" || error?.statusCode === 404) {
        return response.status(200).json([]);
      }

      console.error(`Failed to load ${type}:`, error);
      return response.status(500).json({ error: "Data load failed" });
    }
  }

  if (request.method === "POST") {
    try {
      const data = getRequestBody(request.body);
      if (!Array.isArray(data) || data.length === 0) {
        return response.status(400).json({ error: "Expected a non-empty array" });
      }

      await put(pathname, JSON.stringify(data), {
        access: "private",
        allowOverwrite: true,
        cacheControlMaxAge: 60,
        contentType: "application/json",
      });

      return response.status(200).json({ saved: true, count: data.length });
    } catch (error) {
      console.error(`Failed to save ${type}:`, error);
      return response.status(500).json({ error: "Data save failed" });
    }
  }

  response.setHeader("Allow", "GET, POST");
  return response.status(405).json({ error: "Method not allowed" });
};

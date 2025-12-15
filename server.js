const express = require("express");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();
app.use(express.json());

// ---------- อ่านค่าจาก .env ----------
const PORT = process.env.PORT || 3000;
const LOCAL_API_KEY = process.env.LOCAL_API_KEY;
const LUARMOR_API_KEY = process.env.LUARMOR_API_KEY;
const LUARMOR_API_URL = process.env.LUARMOR_API_URL;
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN;

// ถ้าคุณอยู่หลัง reverse proxy / tunnel บ่อยๆ แนะนำให้เปิด trust proxy
// - ถ้าคุม infra เอง (เช่นมี Nginx หน้า) ใช้ค่า 1 หรือ "loopback"
// - ถ้าอยู่บนแพลตฟอร์ม cloud บางทีใช้ true ไปเลยก็สะดวก แต่ระวังการ spoof header
app.set("trust proxy", true);

console.log("LOCAL_API_KEY: ", LOCAL_API_KEY);
console.log("LUARMOR_API_KEY: ", LUARMOR_API_KEY ? "[HIDDEN]" : "(missing)");
console.log("LUARMOR_API_URL: ", LUARMOR_API_URL);
console.log("ALLOWED_ORIGIN: ", ALLOWED_ORIGIN);

// ---------- Rate Limiting (Simple in-memory) ----------
// ใน production ควรใช้ Redis หรือ rate limiting library เช่น express-rate-limit
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5; // 5 requests per minute per IP

function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

// Cleanup old rate limit records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// ---------- helper: สุ่ม discord id ----------
function generateDiscordId() {
  const length = Math.floor(Math.random() * 3) + 17; // 17-19 digits
  let id = "";
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * 10);
  }
  if (id.startsWith("0")) id = "1" + id.slice(1); // ตัวแรกไม่เป็น 0
  return id;
}

// ---------- helper: หา client ip ให้ "ใกล้ความจริง" ที่สุด ----------
function getClientIpDetails(req) {
  const h = req.headers || {};
  const xff = (h["x-forwarded-for"] || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);

  // ลำดับความน่าเชื่อถือโดยทั่วไป (ขึ้นกับ infra):
  // - Cloudflare: cf-connecting-ip / true-client-ip
  // - Proxy chain: x-forwarded-for (ตัวแรกมักเป็น client)
  // - Express: req.ip (ขึ้นกับ trust proxy)
  // - Socket: remoteAddress (มักเป็น proxy)
  const cfConnectingIp = h["cf-connecting-ip"];
  const trueClientIp = h["true-client-ip"];
  const realIp = h["x-real-ip"];

  const chosen =
    cfConnectingIp ||
    trueClientIp ||
    (xff.length ? xff[0] : null) ||
    realIp ||
    req.ip ||
    req.socket?.remoteAddress ||
    null;

  return {
    chosen_ip: chosen,
    express_ip: req.ip,
    remote_address: req.socket?.remoteAddress,
    remote_port: req.socket?.remotePort,
    x_forwarded_for: xff,
    x_real_ip: realIp,
    cf_connecting_ip: cfConnectingIp,
    true_client_ip: trueClientIp,
  };
}

// ---------- middleware: log รายละเอียด request ให้เยอะที่สุด ----------
app.use((req, res, next) => {
  // อยากให้ log เป็นก้อนอ่านง่าย
  const ip = getClientIpDetails(req);

  const details = {
    time: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    path: req.path,
    query: req.query,
    // อย่าลืมว่าการ log body มีความเสี่ยงหลุดข้อมูลส่วนตัว/secret
    body: req.body,
    http_version: req.httpVersion,
    protocol: req.protocol,
    secure: req.secure,
    hostname: req.hostname,
    // ข้อมูลเครือข่าย
    ip,
    // headers สำคัญ
    headers: {
      host: req.headers["host"],
      origin: req.headers["origin"],
      referer: req.headers["referer"],
      "user-agent": req.headers["user-agent"],
      accept: req.headers["accept"],
      "content-type": req.headers["content-type"],
      "content-length": req.headers["content-length"],
      // พวก proxy headers
      "x-forwarded-for": req.headers["x-forwarded-for"],
      "x-forwarded-proto": req.headers["x-forwarded-proto"],
      "x-forwarded-host": req.headers["x-forwarded-host"],
      "x-real-ip": req.headers["x-real-ip"],
      "cf-connecting-ip": req.headers["cf-connecting-ip"],
      "true-client-ip": req.headers["true-client-ip"],
    },
  };

  console.log("📥 Incoming Request:\n", JSON.stringify(details, null, 2));

  // log ตอน response เสร็จด้วย (status + latency)
  const start = Date.now();
  res.on("finish", () => {
    const ms = Date.now() - start;
    console.log(
      `📤 Response: ${req.method} ${req.originalUrl} -> ${res.statusCode} (${ms}ms) | ip=${ip.chosen_ip}`
    );
  });

  next();
});

// ---------- middleware: ตรวจสอบ origin/referer (ถ้ามี ALLOWED_ORIGIN) ----------
app.use((req, res, next) => {
  if (req.path === "/") return next(); // health check
  if (!ALLOWED_ORIGIN) return next(); // ถ้าไม่มี ALLOWED_ORIGIN ให้ผ่าน

  const origin = req.headers["origin"];
  const referer = req.headers["referer"];
  const allowedOrigins = ALLOWED_ORIGIN.split(",").map((o) => o.trim());

  const isValidOrigin = origin && allowedOrigins.some((allowed) => origin.startsWith(allowed));
  const isValidReferer = referer && allowedOrigins.some((allowed) => referer.startsWith(allowed));

  // ถ้าไม่มี origin และ referer เลย อาจเป็น request จาก server-to-server (เช่น Next.js API route)
  // ในกรณีนี้ให้ตรวจสอบ user-agent แทน
  const userAgent = req.headers["user-agent"] || "";
  const isServerRequest = userAgent.includes("axios") || userAgent.includes("node");

  // ถ้าเป็น server request (เช่นจาก Next.js API route) ให้ผ่าน
  // แต่ถ้าเป็น browser request ต้องมี origin หรือ referer
  if (!isServerRequest && !isValidOrigin && !isValidReferer) {
    const ip = getClientIpDetails(req);
    console.log(`❌ Blocked: Invalid origin/referer | ip=${ip.chosen_ip} | origin=${origin} | referer=${referer}`);
    return res.status(403).json({ error: "Forbidden: Invalid origin" });
  }

  next();
});

// ---------- middleware: Rate Limiting ----------
app.use((req, res, next) => {
  if (req.path === "/") return next(); // health check

  const ip = getClientIpDetails(req);
  const clientIp = ip.chosen_ip || "unknown";

  if (!checkRateLimit(clientIp)) {
    console.log(`❌ Blocked: Rate limit exceeded | ip=${clientIp}`);
    return res.status(429).json({ error: "Too many requests. Please try again later." });
  }

  next();
});

// ---------- ตรวจ x-api-key (server-side) ----------
app.use((req, res, next) => {
  if (req.path === "/") return next(); // health check
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== LOCAL_API_KEY) {
    const ip = getClientIpDetails(req);
    console.log(`❌ Blocked request: invalid/missing x-api-key | ip=${ip.chosen_ip}`);
    return res.status(403).json({ error: "Forbidden: Invalid or missing API key" });
  }
  next();
});

// ---------- Endpoint: สร้าง key โดย forward ไป Luarmor ----------
app.post("/create-key", async (req, res) => {
  try {
    const discordId = req.body?.discord_id || generateDiscordId();
    const payload = {
      discord_id: discordId,
      auth_expire: Math.floor(Date.now() / 1000) + 4 * 60 * 60 // 4 hours
    };

    const response = await axios.post(LUARMOR_API_URL, payload, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": LUARMOR_API_KEY
      },
      timeout: 30000
    });

    res.json({
      ok: true,
      discord_id: discordId,
      luarmor_status: response.status,
      luarmor_data: response.data
    });
  } catch (err) {
    console.error("Error creating key:", err?.response?.data ?? err.message);
    if (err.response) {
      return res.status(err.response.status).json({ error: err.response.data });
    }
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Health check
app.get("/", (req, res) => res.send("✅ Tunnel API is running!"));

// Run server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


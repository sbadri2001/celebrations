import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";

// Types inside backend
interface Team {
  id: string;
  name: string;
  block: string;
  logoUrl: string;
  captainName: string;
  captainUrl: string;
  captainUrl?: string;
  viceCaptainName: string;
  viceCaptainUrl: string;
  viceCaptainUrl?: string;
  participantCount?: number;
  dateCreated: string;
  email: string;
  email?: string;
  editionId?: string;
}

// In-Memory Database seed for Teams
let teamsDb: Team[] = [
  {
    id: "t1",
    name: "Lions FC",
    block: "AH",
    logoUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Daniel Carter",
    captainUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Marcus Vance",
    viceCaptainUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 15,
    email: "lions.fc@example.com",
    dateCreated: "2 days ago",
  },
  {
    id: "t2",
    name: "Rising Spinners",
    block: "BH",
    logoUrl:
      "https://images.unsplash.com/photo-1540747737956-37872f047fc7?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Sanjay Mehta",
    captainUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Lucas Reynolds",
    viceCaptainUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 12,
    email: "spinners@juniorcricket.org",
    dateCreated: "Yesterday",
  },
  {
    id: "t3",
    name: "Prana Yogis",
    block: "CH",
    logoUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Elena Rostova",
    captainUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Sarah Jenkins",
    viceCaptainUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 8,
    email: "prana@yoga-active.com",
    dateCreated: "3 days ago",
  },
  {
    id: "t4",
    name: "Westend Strikers",
    block: "DK",
    logoUrl:
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Rupert Finch",
    captainUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Owen Vance",
    viceCaptainUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 18,
    email: "strikers@westend.com",
    dateCreated: "4 days ago",
  },
  {
    id: "t5",
    name: "Apex Raiders",
    block: "EN",
    logoUrl:
      "https://images.unsplash.com/photo-1540747737956-37872f047fc7?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Maya Lin",
    captainUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Koji Sato",
    viceCaptainUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 14,
    email: "raiders@apex.org",
    dateCreated: "5 days ago",
  },
  {
    id: "t6",
    name: "Coastal Crest",
    block: "FL",
    logoUrl:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Leo Mercer",
    captainUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Diana Prince",
    viceCaptainUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 10,
    email: "coastal.crest@example.com",
    dateCreated: "1 week ago",
  },
  {
    id: "t7",
    name: "Titans United",
    block: "GM",
    logoUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Arjun Nair",
    captainUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Zoe Chen",
    viceCaptainUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 20,
    email: "titans@united.org",
    dateCreated: "2 weeks ago",
  },
];

// Helper for ESM compatibility if running with dual environments:
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON and request body parser
  app.use(express.json());

  // Response formatter middleware to guarantee standard JSON response format
  app.use((req, res, next) => {
    const originalJson = res.json;
    res.json = function (body: any) {
      if (
        body &&
        typeof body === "object" &&
        "status" in body &&
        "statusCode" in body &&
        "data" in body
      ) {
        return originalJson.call(this, body);
      }

      const isSuccess = res.statusCode >= 200 && res.statusCode < 300;

      const formatted = {
        status: isSuccess ? "SUCCESS" : "FAILURE",
        statusCode: res.statusCode,
        message:
          body?.message ||
          (isSuccess
            ? "Request processed successfully"
            : "An error occurred during request processing"),
        data: isSuccess ? body : null,
        errorCode: isSuccess
          ? null
          : body?.errorCode || body?.error || "UNKNOWN_ERROR",
        timestamp: new Date().toISOString(),
        requestId: `req-${Math.random().toString(36).substring(2, 11)}`,
      };

      return originalJson.call(this, formatted);
    };
    next();
  });

  // Log incoming requests for audit and error debugging
  app.use((req, res, next) => {
    console.log(`[API GATEWAY] ${req.method} ${req.url}`);
    next();
  });

  // Transparent reverse proxy to Nest.js server on Port 3001
  app.use("/api", async (req, res, next) => {
    // Avoid proxying the main API health check of the gateway itself
    if (req.url === "/health") {
      return next();
    }

    const targetUrl = `http://localhost:3001/api${req.url}`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10.0 second timeout for checking and proxying

      const headers = new Headers();
      Object.entries(req.headers).forEach(([key, val]) => {
        if (val !== undefined && key !== "host" && key !== "connection") {
          if (Array.isArray(val)) {
            val.forEach((v) => headers.append(key, v));
          } else {
            headers.set(key, val);
          }
        }
      });

      const options: RequestInit = {
        method: req.method,
        headers: headers,
        signal: controller.signal,
      };

      if (
        ["POST", "PUT", "PATCH", "DELETE"].includes(req.method) &&
        req.body &&
        Object.keys(req.body).length > 0
      ) {
        options.body = JSON.stringify(req.body);
        headers.set("content-type", "application/json");
      }

      const response = await fetch(targetUrl, options);
      clearTimeout(timeoutId);

      response.headers.forEach((value, name) => {
        if (name !== "transfer-encoding" && name !== "connection") {
          res.setHeader(name, value);
        }
      });

      const arrayBuffer = await response.arrayBuffer();
      res.status(response.status).send(Buffer.from(arrayBuffer));
    } catch (error: any) {
      console.error(
        `[API GATEWAY] Proxy connection to NestJS on port 3001 failed:`,
        error,
      );
      res.status(502).json({
        success: false,
        message: `Bad Gateway: Connection to backend server on port 3001 failed. Details: ${error.message || error}`,
      });
    }
  });

  // REST API Routes - NestJS Style Controller Endpoints

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  // Authenticaton Endpoints
  // 1. REGISTER USER (POST /api/auth/register)
  app.post("/api/auth/register", (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required parameters.",
      });
    }
    const mockUser = {
      id: `u-${Date.now()}`,
      name,
      email,
      role: role || "user",
      avatarUrl: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80`,
    };
    res.status(201).json({
      success: true,
      user: mockUser,
      accessToken: `mock-sess-token-${Date.now()}`,
      expiresIn: 3600,
    });
  });

  // 2. LOGIN USER (POST /api/auth/login)
  app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email identifier is required." });
    }
    // Simulate invalid login for 'fail@example.com' or 'error' password
    if (email === "fail@example.com" || password === "error") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials provided." });
    }
    const name = email.split("@")[0];
    const mockUser = {
      id: "u-admin",
      name: name.charAt(0).toUpperCase() + name.slice(1),
      email: email,
      role: "admin",
      avatarUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    };
    res.json({
      success: true,
      user: mockUser,
      accessToken: `mock-sess-token-${Date.now()}`,
      expiresIn: 3600,
    });
  });

  // 3. REFRESH TOKEN (POST /api/auth/refresh)
  app.post("/api/auth/refresh", (req, res) => {
    res.json({
      success: true,
      user: {
        id: "u-admin",
        name: "Admin",
        email: "you@example.com",
        role: "admin",
        avatarUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
      },
      accessToken: `mock-sess-token-refreshed-${Date.now()}`,
      expiresIn: 3600,
    });
  });

  // 4. LOGOUT USER (POST /api/auth/logout)
  app.post("/api/auth/logout", (req, res) => {
    res.json({ success: true });
  });

  // 1. GET ALL TEAMS (GET /api/teams)
  app.get("/api/teams", (req, res) => {
    res.json(teamsDb);
  });

  // 2. CREATE TEAM (POST /api/teams)
  app.post("/api/teams", (req, res) => {
    const {
      name,
      block,
      editionId,
      logoUrl,
      captainName,
      captainUrl,
      captainUrl,
      viceCaptainName,
      viceCaptainUrl,
      viceCaptainUrl,
      // participantCount,
      email,
      email,
    } = req.body;

    // Validate request inputs (Mimic Nest.js ValidationPipe behavior)
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Team display name is required." });
    }
    if (!block || block.trim() === "") {
      return res.status(400).json({
        statusCode: 400,
        message: "Block alignment parameter is required.",
      });
    }

    const finalCaptainUrl =
      captainUrl ||
      captainUrl ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
    const finalviceCaptainUrl =
      viceCaptainUrl ||
      viceCaptainUrl ||
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
    const finalEmail = email || email || "placeholder@community.org";
    const finalEditionId = editionId || "";

    const newTeam: Team = {
      id: `t-${Date.now()}`,
      name,
      block: block.toUpperCase(),
      logoUrl:
        logoUrl ||
        "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=150&h=150&q=80",
      captainName: captainName || "TBD",
      captainUrl: finalCaptainUrl,
      captainUrl: finalCaptainUrl,
      viceCaptainName: viceCaptainName || "TBD",
      viceCaptainUrl: finalviceCaptainUrl,
      viceCaptainUrl: finalviceCaptainUrl,
      // participantCount: Number(participantCount) || 0,
      email: finalEmail,
      email: finalEmail,
      editionId: finalEditionId,
      dateCreated: "Just now",
    };

    teamsDb.push(newTeam);
    res.status(201).json(newTeam);
  });

  // 3. UPDATE TEAM (PUT /api/teams/:id)
  app.put("/api/teams/:id", (req, res) => {
    const { id } = req.params;
    const teamIndex = teamsDb.findIndex((t) => t.id === id);

    if (teamIndex === -1) {
      return res.status(404).json({
        statusCode: 404,
        message: `Team record with ID "${id}" was not found.`,
      });
    }

    const currentTeam = teamsDb[teamIndex];
    const {
      name,
      block,
      editionId,
      logoUrl,
      captainName,
      captainUrl,
      captainUrl,
      viceCaptainName,
      viceCaptainUrl,
      viceCaptainUrl,
      // participantCount,
      email,
      email,
      dateCreated,
    } = req.body;

    if (name !== undefined && name.trim() === "") {
      return res.status(400).json({
        statusCode: 400,
        message: "Updated Team name cannot be blank.",
      });
    }

    const finalCaptainUrl =
      captainUrl !== undefined
        ? captainUrl
        : captainUrl !== undefined
          ? captainUrl
          : currentTeam.captainUrl;
    const finalviceCaptainUrl =
      viceCaptainUrl !== undefined
        ? viceCaptainUrl
        : viceCaptainUrl !== undefined
          ? viceCaptainUrl
          : currentTeam.viceCaptainUrl;
    const finalEmail =
      email !== undefined
        ? email
        : email !== undefined
          ? email
          : currentTeam.email;
    const finalEditionId =
      editionId !== undefined ? editionId : currentTeam.editionId;

    const updatedTeam: Team = {
      ...currentTeam,
      name: name !== undefined ? name : currentTeam.name,
      block: block !== undefined ? block.toUpperCase() : currentTeam.block,
      logoUrl: logoUrl !== undefined ? logoUrl : currentTeam.logoUrl,
      captainName:
        captainName !== undefined ? captainName : currentTeam.captainName,
      captainUrl: finalCaptainUrl,
      captainUrl: finalCaptainUrl,
      viceCaptainName:
        viceCaptainName !== undefined
          ? viceCaptainName
          : currentTeam.viceCaptainName,
      viceCaptainUrl: finalviceCaptainUrl,
      viceCaptainUrl: finalviceCaptainUrl,
      // participantCount:
      //   participantCount !== undefined
      //     ? Number(participantCount)
      //     : currentTeam.participantCount,
      email: finalEmail,
      email: finalEmail,
      editionId: finalEditionId,
      dateCreated:
        dateCreated !== undefined ? dateCreated : currentTeam.dateCreated,
    };

    teamsDb[teamIndex] = updatedTeam;
    res.json(updatedTeam);
  });

  // 4. DELETE TEAM (DELETE /api/teams/:id)
  app.delete("/api/teams/:id", (req, res) => {
    const { id } = req.params;
    const teamIndex = teamsDb.findIndex((t) => t.id === id);

    if (teamIndex === -1) {
      return res.status(404).json({
        statusCode: 404,
        message: `Team record with ID "${id}" was not found.`,
      });
    }

    teamsDb = teamsDb.filter((t) => t.id !== id);
    res.json({ success: true, id });
  });

  // --- EDITIONS IN-MEMORY DB & REST API ENDPOINTS ---
  interface Edition {
    id: string;
    name: string;
    year: number;
    description: string;
    isActive: boolean;
    status: "draft" | "active";
    createdAt?: string;
  }

  let editionsDb: Edition[] = [
    {
      id: "ed-1",
      name: "Summer Festival 2024",
      year: 2024,
      description:
        "Last years gorgeous community collection of events & art showcases",
      isActive: false,
      status: "draft",
      createdAt: "2024-06-15T08:00:00.000Z",
    },
    {
      id: "ed-2",
      name: "Autumn Gala 2025",
      year: 2025,
      description:
        "Active autumn competitions featuring community block wars & food fairs",
      isActive: false,
      status: "draft",
      createdAt: "2025-09-10T14:30:00.000Z",
    },
  ];

  // 1. GET ALL EDITIONS
  app.get("/api/editions", (req, res) => {
    res.json(editionsDb);
  });

  // 2. CREATE EDITION
  app.post("/api/editions", (req, res) => {
    const { name, year, description, isActive } = req.body;
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Edition name is required." });
    }
    const targetYear = Number(year) || new Date().getFullYear();
    const shouldBeActive = !!isActive;

    const newEdition: Edition = {
      id: `ed-${Date.now()}`,
      name: name.trim(),
      year: targetYear,
      description: description || "New community festival celebration edition.",
      isActive: shouldBeActive,
      status: shouldBeActive ? "active" : "draft",
      createdAt: new Date().toISOString(),
    };

    editionsDb.push(newEdition);
    res.status(201).json(newEdition);
  });

  // 3. ACTIVATE EDITION
  app.put("/api/editions/:id/activate", (req, res) => {
    const { id } = req.params;
    const editionIndex = editionsDb.findIndex((e) => e.id === id);

    if (editionIndex === -1) {
      return res.status(404).json({
        statusCode: 404,
        message: `Edition record with ID "${id}" was not found.`,
      });
    }

    // Activate the requested one
    editionsDb[editionIndex].isActive = true;
    editionsDb[editionIndex].status = "active";

    res.json(editionsDb[editionIndex]);
  });

  // 3b. DEACTIVATE EDITION
  app.put("/api/editions/:id/deactivate", (req, res) => {
    const { id } = req.params;
    const editionIndex = editionsDb.findIndex((e) => e.id === id);

    if (editionIndex === -1) {
      return res.status(404).json({
        statusCode: 404,
        message: `Edition record with ID "${id}" was not found.`,
      });
    }

    // Deactivate the requested one
    editionsDb[editionIndex].isActive = false;
    editionsDb[editionIndex].status = "draft";

    res.json(editionsDb[editionIndex]);
  });

  // 4. UPDATE EDITION
  app.put("/api/editions/:id", (req, res) => {
    const { id } = req.params;
    const editionIndex = editionsDb.findIndex((e) => e.id === id);

    if (editionIndex === -1) {
      return res.status(404).json({
        statusCode: 404,
        message: `Edition record with ID "${id}" was not found.`,
      });
    }

    const { name, year, description, isActive, status } = req.body;
    const current = editionsDb[editionIndex];

    const shouldBeActive =
      isActive !== undefined ? !!isActive : current.isActive;

    const updatedEdition: Edition = {
      ...current,
      name: name !== undefined ? name.trim() : current.name,
      year: year !== undefined ? Number(year) : current.year,
      description:
        description !== undefined ? description : current.description,
      isActive: shouldBeActive,
      status: shouldBeActive
        ? "active"
        : status !== undefined
          ? status
          : current.status,
    };

    editionsDb[editionIndex] = updatedEdition;
    res.json(updatedEdition);
  });

  // 5. DELETE EDITION
  app.delete("/api/editions/:id", (req, res) => {
    const { id } = req.params;
    const editionIndex = editionsDb.findIndex((e) => e.id === id);

    if (editionIndex === -1) {
      return res.status(404).json({
        statusCode: 404,
        message: `Edition record with ID "${id}" was not found.`,
      });
    }

    editionsDb = editionsDb.filter((e) => e.id !== id);
    res.json({ success: true, id });
  });

  // Vite middleware for rendering react template
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(
      `[FULL-STACK APPLICATION] Express API server running on http://0.0.0.0:${PORT}`,
    );
    console.log(`[ENVIRONMENT] ${process.env.NODE_ENV || "development"}`);
  });
}

startServer();

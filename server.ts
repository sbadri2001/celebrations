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
  captainPictureUrl: string;
  viceCaptainName: string;
  viceCaptainPictureUrl: string;
  participantCount: number;
  dateCreated: string;
  contactEmail: string;
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
    captainPictureUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Marcus Vance",
    viceCaptainPictureUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 15,
    contactEmail: "lions.fc@example.com",
    dateCreated: "2 days ago",
  },
  {
    id: "t2",
    name: "Rising Spinners",
    block: "BH",
    logoUrl:
      "https://images.unsplash.com/photo-1540747737956-37872f047fc7?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Sanjay Mehta",
    captainPictureUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Lucas Reynolds",
    viceCaptainPictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 12,
    contactEmail: "spinners@juniorcricket.org",
    dateCreated: "Yesterday",
  },
  {
    id: "t3",
    name: "Prana Yogis",
    block: "CH",
    logoUrl:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Elena Rostova",
    captainPictureUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Sarah Jenkins",
    viceCaptainPictureUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 8,
    contactEmail: "prana@yoga-active.com",
    dateCreated: "3 days ago",
  },
  {
    id: "t4",
    name: "Westend Strikers",
    block: "DK",
    logoUrl:
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Rupert Finch",
    captainPictureUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Owen Vance",
    viceCaptainPictureUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 18,
    contactEmail: "strikers@westend.com",
    dateCreated: "4 days ago",
  },
  {
    id: "t5",
    name: "Apex Raiders",
    block: "EN",
    logoUrl:
      "https://images.unsplash.com/photo-1540747737956-37872f047fc7?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Maya Lin",
    captainPictureUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Koji Sato",
    viceCaptainPictureUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 14,
    contactEmail: "raiders@apex.org",
    dateCreated: "5 days ago",
  },
  {
    id: "t6",
    name: "Coastal Crest",
    block: "FL",
    logoUrl:
      "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Leo Mercer",
    captainPictureUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Diana Prince",
    viceCaptainPictureUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 10,
    contactEmail: "coastal.crest@example.com",
    dateCreated: "1 week ago",
  },
  {
    id: "t7",
    name: "Titans United",
    block: "GM",
    logoUrl:
      "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=150&h=150&q=80",
    captainName: "Arjun Nair",
    captainPictureUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&h=150&q=80",
    viceCaptainName: "Zoe Chen",
    viceCaptainPictureUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    participantCount: 20,
    contactEmail: "titans@united.org",
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

  // Log incoming requests for audit and error debugging
  app.use((req, res, next) => {
    console.log(`[API GATEWAY] ${req.method} ${req.url}`);
    next();
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
      return res
        .status(400)
        .json({
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
      logoUrl,
      captainName,
      captainPictureUrl,
      viceCaptainName,
      viceCaptainPictureUrl,
      participantCount,
      contactEmail,
    } = req.body;

    // Validate request inputs (Mimic Nest.js ValidationPipe behavior)
    if (!name || name.trim() === "") {
      return res
        .status(400)
        .json({ statusCode: 400, message: "Team display name is required." });
    }
    if (!block || block.trim() === "") {
      return res
        .status(400)
        .json({
          statusCode: 400,
          message: "Block alignment parameter is required.",
        });
    }

    const newTeam: Team = {
      id: `t-${Date.now()}`,
      name,
      block: block.toUpperCase(),
      logoUrl:
        logoUrl ||
        "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=150&h=150&q=80",
      captainName: captainName || "TBD",
      captainPictureUrl:
        captainPictureUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      viceCaptainName: viceCaptainName || "TBD",
      viceCaptainPictureUrl:
        viceCaptainPictureUrl ||
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
      participantCount: Number(participantCount) || 0,
      contactEmail: contactEmail || "placeholder@community.org",
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
      return res
        .status(404)
        .json({
          statusCode: 404,
          message: `Team record with ID "${id}" was not found.`,
        });
    }

    const currentTeam = teamsDb[teamIndex];
    const {
      name,
      block,
      logoUrl,
      captainName,
      captainPictureUrl,
      viceCaptainName,
      viceCaptainPictureUrl,
      participantCount,
      contactEmail,
      dateCreated,
    } = req.body;

    if (name !== undefined && name.trim() === "") {
      return res
        .status(400)
        .json({
          statusCode: 400,
          message: "Updated Team name cannot be blank.",
        });
    }

    const updatedTeam: Team = {
      ...currentTeam,
      name: name !== undefined ? name : currentTeam.name,
      block: block !== undefined ? block.toUpperCase() : currentTeam.block,
      logoUrl: logoUrl !== undefined ? logoUrl : currentTeam.logoUrl,
      captainName:
        captainName !== undefined ? captainName : currentTeam.captainName,
      captainPictureUrl:
        captainPictureUrl !== undefined
          ? captainPictureUrl
          : currentTeam.captainPictureUrl,
      viceCaptainName:
        viceCaptainName !== undefined
          ? viceCaptainName
          : currentTeam.viceCaptainName,
      viceCaptainPictureUrl:
        viceCaptainPictureUrl !== undefined
          ? viceCaptainPictureUrl
          : currentTeam.viceCaptainPictureUrl,
      participantCount:
        participantCount !== undefined
          ? Number(participantCount)
          : currentTeam.participantCount,
      contactEmail:
        contactEmail !== undefined ? contactEmail : currentTeam.contactEmail,
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
      return res
        .status(404)
        .json({
          statusCode: 404,
          message: `Team record with ID "${id}" was not found.`,
        });
    }

    teamsDb = teamsDb.filter((t) => t.id !== id);
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

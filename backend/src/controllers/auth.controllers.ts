import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
  throw new Error("Faltan variables de entorno JWT");
}
const prisma = new PrismaClient();

// Esquema de validación
const loginSchema = z.object({
  login: z.string().min(3), // Puede ser email o username
  password: z.string().min(6),
});

// Configuración de JWT
const JWT_CONFIG = {
  access: {
    secret: process.env.JWT_ACCESS_SECRET as Secret, // Conversión explícita
    options: {
      algorithm: "HS256" as const, // Tipo literal
      expiresIn: "15m",
    } satisfies SignOptions, // Validación de tipo
  },
  refresh: {
    secret: process.env.JWT_REFRESH_SECRET as Secret,
    options: {
      algorithm: "HS256" as const,
      expiresIn: "7d",
    } satisfies SignOptions,
  },
};

// Función generadora de tokens corregida
const generateTokens = (userId: bigint) => {
  const accessToken = jwt.sign(
    { sub: userId.toString() }, // Payload
    JWT_CONFIG.access.secret, // Secret (tipo correcto)
    JWT_CONFIG.access.options // Opciones tipadas
  );

  const refreshToken = jwt.sign(
    { sub: userId.toString() },
    JWT_CONFIG.refresh.secret,
    JWT_CONFIG.refresh.options
  );

  return { accessToken, refreshToken };
};

export const login = async (req: Request, res: Response) => {
  try {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Datos inválidos",
        detalles: result.error.flatten(),
      });
    }

    const { login: userInput, password } = result.data;

    const usuario = await prisma.usuario.findFirst({
      where: {
        OR: [{ email: userInput }, { username: userInput }],
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const passwordMatch = await bcrypt.compare(password, usuario.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    const { accessToken, refreshToken } = generateTokens(usuario.id);
    const { password: _, ...userWithoutPassword } = usuario;

    res.status(200).json({
      success: true,
      message: "✅ Inicio de sesión exitoso",
      tokens: {
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      error: "Error en el servidor",
      detalles: process.env.NODE_ENV === "development" ? error.message : null,
    });
  }
};

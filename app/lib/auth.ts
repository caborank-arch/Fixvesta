import jwt from "jsonwebtoken";
import { ethers } from "ethers";

export interface AuthPayload {
  userId: number;
  walletAddress: string;
  walletType: string;
}

export function signJWT(payload: AuthPayload): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not configured");
  return jwt.sign(payload, secret, { expiresIn: "24h" });
}

export async function verifyJWT(req: Request): Promise<AuthPayload | null> {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  try {
    const token = authHeader.slice(7);
    return jwt.verify(token, secret) as AuthPayload;
  } catch {
    return null;
  }
}

export function isAdmin(walletAddress: string): boolean {
  const list = (process.env.ADMIN_WALLETS ?? "")
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean);
  return list.includes(walletAddress.toLowerCase());
}

// EVM (BSC) signature verification via ethers v6
export function verifyEVMSignature(message: string, signature: string, claimedAddress: string): boolean {
  try {
    const recovered = ethers.verifyMessage(message, signature);
    return recovered.toLowerCase() === claimedAddress.toLowerCase();
  } catch {
    return false;
  }
}

export function authMessage(nonce: string, appName = "fixvesta.com"): string {
  return `Sign in to ${appName}\nNonce: ${nonce}`;
}

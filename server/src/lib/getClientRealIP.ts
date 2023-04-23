import { Request } from "express";

/**
 * Detektira IP adresu klijenta
 * @param req HTTP request object
 * @returns IP adresa klijenta
 */
const getClientRealIP = (req: Request) => {
  // CloudFlare performs NAT and forwards origin IP address in HTTP header
  const CF_Connecting_IP = req.headers["cf-connecting-ip"];

  // 1. prioritt = CloudFlare - vanjski klijenti spojeni na njega
  if (CF_Connecting_IP) {
    return CF_Connecting_IP as string;
  }

  // FGT gateway/SSL offloader do NAT, so original client IP address is
  // not directly available. Instead it is forwarded via a HTTP header
  const X_Forwarded_For = req.headers["x-forwarded-for"];

  // 2. prioritet = X_Forwarded_For (dodaje FGT) - za slučaj kada promet ne ide kroz CF (npr lokalni promet koji ide preko FGT load balancera)
  if (X_Forwarded_For) {
    return X_Forwarded_For as string;
  }

  // IP adresa klijenta koji se spojio na express server (npr reverse proxy ili dev računalo)
  const direct_client_IP = req.ip;

  // na lokalnom računalu IP adresa može biti u IPv6 formatu
  if (direct_client_IP === `:::ffff:${process.env.LOCAL_IP}`) {
    return process.env.LOCAL_IP; // vraćam IPv4 adresu
  }

  // 3. prioritet = direct_client_IP - korisno za lokalno testiranje na DEV mašini
  return direct_client_IP;
};

export default getClientRealIP;

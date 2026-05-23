/**
 * Updates CBB token on-chain metadata (name, symbol, URI with logo).
 * Run once with your update authority keypair.
 *
 * Usage:
 *   node scripts/update-token-metadata.mjs <BASE58_PRIVATE_KEY>
 *
 * Example:
 *   node scripts/update-token-metadata.mjs 5Kd3NBUAdUnhyzenEwVLy9pBKKDieLfRzBR7...
 */

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  mplTokenMetadata,
  updateV1,
  fetchMetadataFromSeeds,
} from "@metaplex-foundation/mpl-token-metadata";
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey,
} from "@metaplex-foundation/umi";
import bs58 from "bs58";

const MINT = process.env.CBB_MINT || process.argv[3];
if (!MINT) {
  console.error("Set CBB_MINT in env or pass as second arg.");
  process.exit(1);
}
const METADATA_URI = process.env.TOKEN_METADATA_URI || "https://fixvesta.com/token-metadata.json";

const secretB58 = process.argv[2];
if (!secretB58) {
  console.error("Usage: node scripts/update-token-metadata.mjs <BASE58_PRIVATE_KEY>");
  process.exit(1);
}

const secretBytes = bs58.decode(secretB58);

const umi = createUmi("https://api.mainnet-beta.solana.com").use(mplTokenMetadata());

const keypair = umi.eddsa.createKeypairFromSecretKey(secretBytes);
const signer  = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

console.log("Update authority:", keypair.publicKey);
console.log("Mint:", MINT);
console.log("New URI:", METADATA_URI);
console.log("Fetching existing metadata...");

const metadata = await fetchMetadataFromSeeds(umi, { mint: publicKey(MINT) });
console.log("Current name:", metadata.name);
console.log("Current URI:", metadata.uri);

console.log("\nSending update transaction...");

const { signature } = await updateV1(umi, {
  mint: publicKey(MINT),
  data: {
    ...metadata,
    name:   "Caboblock",
    symbol: "CBB",
    uri:    METADATA_URI,
    sellerFeeBasisPoints: 0,
  },
}).sendAndConfirm(umi);

console.log("\n✓ Metadata updated!");
console.log("TX:", Buffer.from(signature).toString("base64"));
console.log("\nSolscan and other explorers will pick up the new logo within a few minutes.");

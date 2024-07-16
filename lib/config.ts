export default {
  secretPhrase: process.env.PRIVATE_KEY,
  rpcURL: process.env.RPC_URL,
  userAddress: process.env.ADDRESS,
  pcsRouterContract: process.env.SWAP_ADDRESS,
  wbnbContract: process.env.WBNB,
  slippage: 5n,
};

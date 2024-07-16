import tokenPrice from "./lib/utils/price";

import { Buy, Sell } from "./lib/swap";
import Web3 from "web3";
import decode from "./lib/utils/decode";



const web3 = new Web3(process.env.RPC_URL);

let balance = await web3.eth.getBalance(process.env.ADDRESS);
console.log('balance', decode.FromWei(balance,18))
if(decode.FromWei(balance,18)<0.03){
    console.log('not enough bnb')
}

let TOKEN_ADDRESS = "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684";

let price = await tokenPrice();
console.log(TOKEN_ADDRESS, 'price', price);

await Buy(
    {
      address: TOKEN_ADDRESS,
      decimals: 18,
      name: "usdt",
    },
    0.03,
  );
  
await Sell(
    {
      address: TOKEN_ADDRESS,
      decimals: 18,
      name: "usdt",
    },
    10,
  );

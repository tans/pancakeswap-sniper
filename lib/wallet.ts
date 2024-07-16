// In case you are using Node.js
import { Web3 } from "web3";
// Setting getblock node as HTTP provider

const web3 = new Web3(process.env.RPC_URL);

// 从私钥导入账户
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

console.log("地址:", account.address);

// 查询账户余额
const balance = await web3.eth.getBalance(account.address);
console.log(balance);
const etherBalance = web3.utils.fromWei(balance, "ether");
console.log(etherBalance);

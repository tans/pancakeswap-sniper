import { toBn } from "evm-bn";
import { ethers } from "ethers";

const FromWei = (amount, decimals) => {
  
    return Number(amount)/   Number(10 ** decimals)
}

const ToWei = (amount, decimals) => {
    console.log(amount, decimals)
    return BigInt(toBn(amount.toString(), decimals)._hex).toString()
}

const Random = (list) => {
    return list[Math.floor(Math.random() * list.length)]
}

export default {
    FromWei,
    ToWei,
    Random
}
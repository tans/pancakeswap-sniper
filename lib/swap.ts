// In case you are using Node.js
import { Web3 } from "web3";
import Contract from "./helpers/contract";
import Decode from "./utils/decode";
import Types from "./utils/types";
// Setting getblock node as HTTP provider
import config from "./config";

console.log(config);

const log = console.log;

const web3 = new Web3(process.env.RPC_URL);

const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);

export const Buy = async (token, amount) => {
  const ContractPCS = (
    await Contract.Instance(Types.ROUTER, config.pcsRouterContract, config)
  ).methods;
  const ContractWBNB = (
    await Contract.Instance(Types.TOKEN, config.wbnbContract, config)
  ).methods;
  const tokenIn = config.wbnbContract;
  const tokenOut = token.address;

  const amountIn = Decode.ToWei(amount, 18);

  var tx = {};
  const supply = await ContractWBNB.totalSupply().call();
  const allowance = await ContractWBNB.allowance(
    config.userAddress,
    config.pcsRouterContract,
  ).call();

  if (
    Decode.FromWei(allowance.toString(), token.decimals) >=
    Decode.FromWei(supply.toString(), token.decimals)
  ) {
    console.log("Already approved");

    tx["status"] = true;
  } else {
    console.log("Approving...");
    tx = await ContractWBNB.approve(
      config.pcsRouterContract,
      Web3.utils
        .toBigInt(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        )
        .toString(),
    ).send();
  }

  if (tx.status) {
    const amounts = await ContractPCS.getAmountsOut(amountIn, [
      tokenIn,
      tokenOut,
    ]).call();
    var amountOutMin = Decode.FromWei(
      amounts[amounts.length - 1],
      token.decimals,
    );
    const expectedAmount = amountOutMin;
    amountOutMin -= (amountOutMin * Number(config.slippage)) / 100;

    log(`
         Buying ${tokenOut}
         =================
         amountIn: ${amount.toString()} ${tokenIn} WBNB
         amountOut: ${parseFloat(expectedAmount)} ${tokenOut}
       `);

    Decode.ToWei(amountOutMin, token.decimals);
    const tx2 = await ContractPCS.swapExactETHForTokens(
      Decode.ToWei(amountOutMin, token.decimals),
      [tokenIn, tokenOut],
      config.userAddress,
      Date.now() + 1000 * 60 * 10,
    ).send({ value: amountIn.toString(), gas: 1000000 });

    if (tx2.status) {
      const receipt = await tx2.transactionHash;

      log(`${tokenOut} bought successfully`);
      log(`https://bscscan.com/tx/${receipt}`);
      log("=================");

      token["transactionHash"] = receipt;
      token["buyAmount"] = amount;
      // token["amountTokens"] = token.amountTokens + parseFloat(expectedAmount);
      token["status"] = "bought";
    } else log(`ERROR: can't buy ${tokenOut}`);
  } else log(`ERROR: Not allowence for ${tokenOut}`);
};

export const Sell = async (token, amount) => {
  const ContractPCS = (
    await Contract.Instance(Types.ROUTER, config.pcsRouterContract, config)
  ).methods;
  const ContractToken = (
    await Contract.Instance(Types.TOKEN, token.address, config)
  ).methods;
  const tokenIn = token.address;
  const tokenOut = config.wbnbContract;

  const amountIn = Decode.ToWei(amount, token.decimals);

  log(`Checking ${token.name} allowance...`);
  var tx = {};
  const supply = await ContractToken.totalSupply().call();
  const allowance = await ContractToken.allowance(
    config.userAddress,
    config.pcsRouterContract,
  ).call();

  if (
    Decode.FromWei(allowance.toString(), token.decimals) >=
    Decode.FromWei(supply.toString(), token.decimals)
  ) {
    log("Already approved");
    tx["status"] = true;
  } else {
    log("Approving...");
    tx = await ContractToken.approve(
      config.pcsRouterContract,
      Web3.utils
        .toBigInt(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
        )
        .toString(),
    ).send();
  }

  if (tx.status) {
    const amounts = await ContractPCS.getAmountsOut(amountIn, [
      tokenIn,
      tokenOut,
    ]).call();

    var amountOutMin = Decode.FromWei(amounts[amounts.length - 1], 18);
    console.log("amountOutMin", amountOutMin);
    const expectedAmount = amountOutMin;
    amountOutMin -= (amountOutMin * Number(config.slippage)) / 100;

    log(`
         Selling ${tokenOut}
         =================
         amountIn: ${amount.toString()} ${tokenIn} ${token.name}
         amountOut: ${parseFloat(expectedAmount)} ${tokenOut} WBNB
       `);

    Decode.ToWei(amountOutMin, 18);

    const tx2 = await ContractPCS.swapExactTokensForETH(
      amountIn,
      Decode.ToWei(amountOutMin, 18),
      [tokenIn, tokenOut],
      config.userAddress,
      Date.now() + 1000 * 60 * 10,
    ).send({ gas: 1000000 });

    if (tx2.status) {
      const receipt = await tx2.transactionHash;

      log(`${tokenOut} sold successfully`);
      log(`https://bscscan.com/tx/${receipt}`);
      log("=================");

      token["transactionHash"] = receipt;
      token["soldAmount"] = parseFloat(expectedAmount);
      token["status"] = "sold";
    } else log(`ERROR: can't buy ${tokenOut}`);
  } else log(`ERROR: Not allowence for ${tokenOut}`);
};

import abi from "./abi/exactInputSingle.json";
import Web3 from "web3";
import HDWalletProvider from "@truffle/hdwallet-provider";
import ethers from "ethers";

require('dotenv').config();

const privateKey = process.env.PRIVATE_KEY || "";
const localKeyProvider = new HDWalletProvider({
 privateKeys: [privateKey],
 providerOrUrl: process.env.POLYGON_RPC_URL,
});
const web3 = new Web3(localKeyProvider as any);

const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
const contractAddress = "0x7CaB4088B48a5010e65ad70C7C546372BA7E55DB";

interface WorldIDVerification {
    root: number
    group: number
    signal: string
    nullifierHash: number
    appID: string
    actionID: string
    proof: number[]
}
  
interface UserOperationVariant {
    sender: string
    worldIDVerification: WorldIDVerification
    callData: string
    callGasLimit: number
}

export async function callExactInputSingle(
  router: string, 
  amountIn: string, 
  amountOutMin: string, 
  tokenIn: string, 
  tokenOut: string
) {
  const contract = new web3.eth.Contract(abi as any, contractAddress);

  // Access the 'cred' data from localStorage
    const credString = localStorage.getItem('cred');

    // Parse the JSON string into an object.
    const cred = JSON.parse(credString || '');

    console.log(cred);

    const worldIDVerif: WorldIDVerification = {
        root: cred.merkle_root,
        group: 1, // update this line accordingly, as the group property is not present in the provided cred object
        signal: cred.signal,
        nullifierHash: cred.nullifier_hash,
        appID: cred.app_id,
        actionID: cred.action,
        proof: cred.proof, // make sure to convert this to the correct format if it's not a number array
      }

  console.log('Starting transaction now');

  console.log('worldIdVerif', worldIDVerif)

  const gasPrice = await web3.eth.getGasPrice();

  console.log('gasPrice', gasPrice);
  
  const encodedCallData = contract.methods.exactInputSingle(
    router,
    amountIn,
    amountOutMin,
    tokenIn,
    tokenOut,
  ).encodeABI();

  console.log('encodedCallData', encodedCallData)

//   const receipt = await web3.eth.sendTransaction({
//     from: myAccount.address,
//     to: contractAddress,
//     data: encodedCallData,
//     gas: 13_000_000,
//     gasPrice: gasPrice,
//   });

//   console.log('TX receipt', receipt);

const userOpCallSwapFunc: UserOperationVariant = {
    sender: '0xa5e508F6C18A1B88Db465602B2488794991eC247',
    worldIDVerification: worldIDVerif,
    callData: encodedCallData,
    callGasLimit: 30_000_000,
}

console.log('myAccount.address', myAccount.address)

const receipt = await web3.eth.sendTransaction({
    from: myAccount.address,
    to: contractAddress,
    data: userOpCallSwapFunc.callData,
    gas: userOpCallSwapFunc.callGasLimit,
    gasPrice: gasPrice,
  });

  console.log('TX receipt', receipt);
}

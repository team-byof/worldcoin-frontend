import HDWalletProvider from "@truffle/hdwallet-provider";
import Web3 from "web3";
import abi from "./abi/exactInputSingle.json";
import entry_point_abi from "./abi/entry_point.json"
import { BigNumber } from "ethers";

require("dotenv").config();



const privateKey = process.env.PRIVATE_KEY || "";
const localKeyProvider = new HDWalletProvider({
  privateKeys: [privateKey],
  providerOrUrl: process.env.POLYGON_RPC_URL,
});
const web3 = new Web3(localKeyProvider as any);

const myAccount = web3.eth.accounts.privateKeyToAccount(privateKey);
const entryPointContractAddress = "0x7CaB4088B48a5010e65ad70C7C546372BA7E55DB";

interface WorldIDVerification {
  root: BigNumber;
  group: BigNumber;
  signal: string;
  nullifierHash: BigNumber;
  appID: string;
  actionID: string;
  proof: BigNumber[];
}

interface UserOperationVariant {
  sender: string;
  worldIDVerification: WorldIDVerification;
  callData: string;
  callGasLimit: number;
}

export async function callExactInputSingle(
  router: string,
  amountIn: string,
  amountOutMin: string,
  tokenIn: string,
  tokenOut: string
) {
  const entryPointContract = new web3.eth.Contract(entry_point_abi as any, entryPointContractAddress);

  // Access the 'cred' data from localStorage
  // const credString = localStorage.getItem('cred');

  // Parse the JSON string into an object.
  // const cred = JSON.parse(credString || '');
  const cred = {
    merkle_root: BigNumber.from("939610978630742860037106091295265106300874214882050385516927854006536605748"),
    group: BigNumber.from("1"),
    signal: "my_signal",
    nullifier_hash: BigNumber.from("0x0ee07808f36969982d25288cef01767c9eebd1d019a1c3a3ad200c5b5e55cae8"),
    app_id: "app_5bf8fcd0369d5ac0ec85529e347b5d57",
    action: "test_2",
    proof: [
      BigNumber.from("8542270648952525673731898458107712225662138660430446132942902685213202470602"),
      BigNumber.from("10018710043607721493297532264810949540821135715131618350961719158348399205787"),
      BigNumber.from("609530776627107284978967943175338187228060330896361330064668769694179845889"),
      BigNumber.from("1315904830230138420980116664361181973915783120777801083684370841268990493717"),
      BigNumber.from("17791960167675277534998862011614460399937959367175037178685013679925572500534"),
      BigNumber.from("15647476419771666171651041146270415217180224891003654272431630708105274971736"),
      BigNumber.from("9561265846941125054549792319126517934630210570900590091660886559124975747143"),
      BigNumber.from("7078960537229967308071328342225677700177359617790010943795560576263472577718")
    ],
  };

  console.log(cred);

  const worldIDVerif: WorldIDVerification = {
    root: cred.merkle_root,
    group: cred.group, // update this line accordingly, as the group property is not present in the provided cred object
    signal: cred.signal,
    nullifierHash: cred.nullifier_hash,
    appID: cred.app_id,
    actionID: cred.action,
    proof: cred.proof, // make sure to convert this to the correct format if it's not a number array
  };

  console.log("Starting transaction now");

  console.log("worldIdVerif", worldIDVerif);

  const gasPrice = await web3.eth.getGasPrice();
  

  console.log("gasPrice", gasPrice);

  const walletContractAddress = "0xa5e508f6c18a1b88db465602b2488794991ec247"
  const walletContract = new web3.eth.Contract(abi as any, walletContractAddress);

  const encodedCallData = walletContract.methods
    .exactInputSingle(router, amountIn, amountOutMin, tokenIn, tokenOut)
    .encodeABI();

  console.log("encodedCallData", encodedCallData);

  //   const receipt = await web3.eth.sendTransaction({
  //     from: myAccount.address,
  //     to: entryPointContractAddress,
  //     data: encodedCallData,
  //     gas: 13_000_000,
  //     gasPrice: gasPrice,
  //   });

  //   console.log('TX receipt', receipt);

  const userOpCallSwapFunc: UserOperationVariant = {
    sender: "0xa5e508F6C18A1B88Db465602B2488794991eC247",
    worldIDVerification: worldIDVerif,
    callData: encodedCallData,
    callGasLimit: 2_500_000,
  };

  console.log("myAccount.address", myAccount.address);

  // const entryPointContractAddress = ""
  // const entryPointContract = new web3.eth.Contract(abi as any, entryPointContractAddress);

  const entryPointCalldata = entryPointContract.methods
    .handleOps([userOpCallSwapFunc])
    .encodeABI();


    // 159662720585 * 3000000
    // 0.454256772009742581 * 1e18


    try {
      const receipt = await web3.eth.sendTransaction({
        from: myAccount.address,
        to: entryPointContractAddress,
        data: entryPointCalldata,
        gas: userOpCallSwapFunc.callGasLimit,
        gasPrice: gasPrice,
      });

      console.log("TX receipt", receipt);
    } catch (e) {
      console.log("error", e);
    }

}

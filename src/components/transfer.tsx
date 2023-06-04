import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Background from '../layouts/background'

import {getBalanceOf} from '../web3/connect_aa';
import { callExactInputSingle } from '../web3/entryPoint';
import web3 from 'web3';

export default function Transfer() {
  const navigate = useNavigate();
  const location = useLocation();

  const onClickBack = () => {
    navigate('/execute')
  }

  const onClickTransfer = () => {
    getBalanceOf(process.env.PUBLIC_KEY || "", "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174")
    callExactInputSingle(
      "0xf5b509bb0909a69b1c207e495f687a596c168e12",
      web3.utils.toWei("0.01", "ether"), // amountIn (0.01 ETH)
      "0", // amountOutMin (minimium amount of output token you want to receive - set to 0 for no minimum)
      "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270", // tokenIn (wMATIC)
      "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619", // tokenOut (wETH)
    )
  }

  const getChainName = (chain: string) => {
    switch (chain) {
      case "polygon":
        return "Polygon"
      case "gnosis":
        return "Gnosis Chain"
      case "near":
        return "Aurora / Near"
    }
  }

  return (
    <Background>
      <div className="flex flex-col text-center">
        <div className="space-y-2 flex flex-col items-center p-8">
          <h3 className="text-3xl text-gray-700 font-semibold text-center">
            Swap on {getChainName(location.state.chain)} 🚀
          </h3>

        </div>
        <div className='flex items-center mx-2 flex'>
            <label className="block mb-2 text-lg font-medium text-gray-700  w-1/6">From</label>
            <div className="bg-pink-100 border border-pink-100 text-gray-900 text-sm rounded-lg block w-full p-2.5 ml-10">
              <img src="https://seeklogo.com/images/P/polygon-matic-logo-86F4D6D773-seeklogo.com.png" alt="matic" width={30} height={30} className="inline pr-2"></img>
              MATIC
            </div>
        </div>
        <div className='flex items-center mx-2 flex'>
            <label className="block mb-2 text-lg font-medium text-gray-700  w-1/6">To</label>
            <div className="bg-pink-100 border border-pink-100 text-gray-900 text-sm rounded-lg block w-full p-2.5 ml-10">
              <img src="https://cryptologos.cc/logos/ethereum-eth-logo.png?v=025" alt="matic" width={30} height={30} className="inline pr-2"></img>
              WETH
            </div>
        </div>
        {/* <div className='flex items-center mx-2 flex'>
            <label className="block mb-2 text-lg font-medium text-gray-700 mr-14  w-1/6">To:</label>
            <input className="bg-pink-100 border border-pink-100 text-gray-900 text-sm rounded-lg block w-full p-2.5" placeholder="0x2f318C334780961FB129D2a6c30D0763d9a5C970" required />
        </div> */}
        <div className='flex items-center mx-2 my-4 flex'>
            <label className="block mb-2 text-lg font-medium text-gray-700 mr-3 w-1/6">Amount:</label>
            <input className="bg-pink-100 border border-pink-100 text-gray-900 text-sm text-center rounded-lg block w-full p-2.5 ml-4" placeholder="0" required />
        </div>
        <button className="py-4 h-1/6 border-4 rounded-2xl hover:bg-pink-100 border-pink-300" onClick={onClickBack}>
          <span className="text-2xl">Back</span>
        </button>
        <button className="py-8 h-1/6 border-4 rounded-2xl hover:bg-pink-100 border-pink-300" onClick={onClickTransfer}>
          <span className="text-2xl">Transfer</span>
        </button>
      </div>
    </Background>
  )
}

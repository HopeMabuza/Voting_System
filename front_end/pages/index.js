import { useState } from "react";
import { ethers } from "ethers";
import VotingABI from "../VotingV1.json";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export default function Home() {
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [option1, setOption1] = useState("");
  const [option2, setOption2] = useState("");
  const [votes1, setVotes1] = useState(0);
  const [votes2, setVotes2] = useState(0);
  const [winner, setWinner] = useState("");
  const [status, setStatus] = useState("");

  async function connectWallet() {
    if (!window.ethereum) return alert("Install MetaMask first!");
    const _provider = new ethers.BrowserProvider(window.ethereum);
    await _provider.send("eth_requestAccounts", []);
    const _signer = await _provider.getSigner();
    const _contract = new ethers.Contract(CONTRACT_ADDRESS, VotingABI.abi, _signer);
    setContract(_contract);
    setAccount(await _signer.getAddress());
    await loadData(_contract);
  }

  async function loadData(_contract) {
    setOption1(await _contract.option1());
    setOption2(await _contract.option2());
    setVotes1((await _contract.option1Votes()).toString());
    setVotes2((await _contract.option2Votes()).toString());
    setWinner(await _contract.winner());
  }

  async function vote(option) {
    try {
      setStatus("Sending vote...");
      const tx = await contract.vote(option);
      await tx.wait();
      setStatus("Vote cast successfully!");
      await loadData(contract);
    } catch (err) {
      setStatus(err.reason || err.message);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">

        <h1 className="text-2xl font-semibold text-center mb-2 text-neutral-700">
          Voting dApp
        </h1>
        <p className="text-center text-sm text-neutral-400 mb-6">Cast your vote on the blockchain</p>

        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full bg-neutral-700 text-white py-2 rounded-lg hover:bg-neutral-600 transition"
          >
            Connect Wallet
          </button>
        ) : (
          <p className="text-center text-xs text-neutral-400 mb-6 truncate">
            Connected: {account}
          </p>
        )}

        {contract && (
          <>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => vote(1)}
                className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 py-4 rounded-xl transition text-center"
              >
                <p className="text-lg font-medium">{option1}</p>
                <p className="text-sm text-neutral-500">{votes1} votes</p>
              </button>

              <button
                onClick={() => vote(2)}
                className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 py-4 rounded-xl transition text-center"
              >
                <p className="text-lg font-medium">{option2}</p>
                <p className="text-sm text-neutral-500">{votes2} votes</p>
              </button>
            </div>

            <div className="mt-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200 text-center">
              <p className="text-xs text-neutral-400 uppercase tracking-wide mb-1">Current Result</p>
              <p className="text-neutral-700 font-medium">{winner}</p>
            </div>

            {status && (
              <p className="mt-4 text-center text-sm text-neutral-500">{status}</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

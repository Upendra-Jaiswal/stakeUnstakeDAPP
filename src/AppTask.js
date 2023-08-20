import "./cssfiles/App.css";
import { ethers } from "ethers";

import StakingTask from "./contracts/abi/StakingTask.json";
import { useEffect, useState } from "react";
import "./cssfiles/design.css";
import fantomimg from "./images/fantom-ftm-logo.png";
import fantomimgNav from "./images/fantomImage.jpeg";
import Footer from "./Footer";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [myBalance, setMyBalance] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(0);
  const [stakeAmount, setStakeAmount] = useState(0);
  const [myStakedAmount, setMyStakedAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [apr, setApr] = useState();
  const [timer, setTimer] = useState();
  const [isContentVisible, setIsContentVisible] = useState(false);

  const toggleContent = () => {
    setIsContentVisible(!isContentVisible);
  };

  useEffect(() => {
    getContract();
    loadWallet();
  }, []);

  const loadWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const accounts = await provider.listAccounts();
    const account = accounts[0];
    const balance = await provider.getBalance(account);
    const balanceInEth = ethers.utils.formatEther(balance);

    setProvider(provider);
    setAccount(account);
    setMyBalance(balanceInEth);
  };

  const getContract = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    if (provider) {
      const abi = StakingTask.abi;
      const contractAddress = "0x571f830C36EAFAe5d11654211636291fa0e460A9";
      const signer = provider.getSigner();
      const contract = await new ethers.Contract(contractAddress, abi, signer);

      setContract(contract);
    }
  };

  const getStakedBalance = async () => {
    if (!contract) return;

    const stakedBalance = await contract.totalStakedToken();
    const balanceInEth = ethers.utils.formatEther(stakedBalance);

    setStakedBalance(balanceInEth);
  };

  const getmyStakedAmount = async () => {
    if (!contract) return;

    const amount = await contract.stakedToken({ from: account });

    const balanceInEth = ethers.utils.formatEther(amount);
    // const formattedBalance = ethers.utils.formatEther(balanceInEth);

    const formattedBalance = new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 2,
    }).format(balanceInEth);

    setMyStakedAmount(formattedBalance);
  };

  const handleChange = (event) => {
    setStakeAmount(event.target.value);
  };

  const stake = async () => {
    if (!contract) return;

    await contract.deposit(stakeAmount, { gasLimit: 750000 });
  };

  const withdraw = async () => {
    if (!contract) return;

    await contract.withdraw(withdrawAmount);
  };

  const getAprAndTimer = async () => {
    if (!contract) return;
    const bonusendblock = await contract.bonusEndBlock();
    const startblock = await contract.startBlock();
    const remainingBlocks = bonusendblock - startblock;

    const remainingTimeInSeconds = remainingBlocks * 15;
    const remainingDays = remainingTimeInSeconds / (60 * 60 * 24);
    const timer = remainingDays;
    const stakedTokenSupply = await contract.stakedToken({
      from: account,
    });
    const stakedTokenSupplyEth = ethers.utils.formatEther(stakedTokenSupply);

    const blocksPerYear = 365 / 15;
    const rewardperblock = await contract.rewardPerBlock();
    const annualReward = rewardperblock * blocksPerYear;
    const precision = await contract.PRECISION_FACTOR();
    const aprval = (annualReward * precision) / stakedTokenSupplyEth;

    setApr(aprval);
    setTimer(timer);
    console.log(typeof timer);
  };
  getAprAndTimer();
  getmyStakedAmount();
  getStakedBalance();

  return (
    <div className="App">
      <div className="navbar">
        <div className="logoNav">
          <img
            src={fantomimgNav}
            alt="Logo"
            style={{ width: "50px", height: "50px", borderRadius: "50%" }}
          />
        </div>
        <div className="accDetails">
          <span className="section-title">
            {provider ? (
              <div>
                {" "}
                Hello {account} <br /> <b>Your Balance:</b> {myBalance}
              </div>
            ) : (
              <button onClick={loadWallet} class="button">
                {" "}
                Connect wallet
              </button>
            )}{" "}
          </span>
        </div>
      </div>

      <div className="body">
        {" "}
        <div className="Card">
          <div className="sections-container">
            <div className="section image-text-container">
              <img
                src={fantomimg}
                alt="Logo"
                style={{ width: "40px", height: "40px", borderRadius: "50%" }}
              />
              <span className="section-title">Earn FTM </span>
            </div>
            <div className="section">
              <span className="section-title">
                Timer <i class="fa fa-clock-o" aria-hidden="true"></i>
                <br />
                {Number(timer).toFixed(2)} days <br />
              </span>
            </div>
            <div className="section">
              <span className="section-title">
                APR
                <br />
                {Number(apr).toFixed(3)}% <br />
              </span>
            </div>
            <div className="section">
              <span className="section-title">
                Total Staked <br />
                {myStakedAmount}
              </span>

              {/* Number(myStakedAmount).toFixed(2) */}
              {/* <button onClick={getmyStakedAmount}>Refresh</button> */}
            </div>
            <div className="section">
              <span className="section-title">
                My Staked {Number(stakedBalance).toFixed(7)}
              </span>
              {/* <button onStakedBalance}>Refresh</button> */}
            </div>

            <div className="section">
              <span onClick={toggleContent} className="toggle-button">
                {isContentVisible ? (
                  <>
                    Hide{" "}
                    <span>
                      <i class="fa fa-angle-up fa-fw"></i>{" "}
                    </span>
                  </>
                ) : (
                  <>
                    Details{" "}
                    <span>
                      <i class="fa fa-angle-down fa-fw"></i>{" "}
                    </span>
                  </>
                )}
              </span>
            </div>
          </div>

          {isContentVisible && (
            <div className="sections-container-two">
              <div className="section-two">
                <input
                  type="text"
                  id="amount"
                  name="amount"
                  onChange={handleChange}
                  value={stakeAmount}
                  autoComplete="off"
                ></input>
                {provider ? (
                  <button onClick={stake} class="button stakebtn">
                    Stake
                  </button>
                ) : (
                  <button onClick={loadWallet} class="button">
                    {" "}
                    Connect wallet
                  </button>
                )}
              </div>
              <div className="section-two">
                <input
                  type="text"
                  id="amountWithdraw"
                  name="amountWithdraw"
                  onChange={(event) => setWithdrawAmount(event.target.value)}
                  value={withdrawAmount}
                  autoComplete="off"
                ></input>{" "}
                {provider ? (
                  <button onClick={withdraw} class="button unstakebtn">
                    Unstake
                  </button>
                ) : (
                  <button onClick={loadWallet} class="button">
                    {" "}
                    Connect wallet
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
export default App;

'use client';
import { useContext, useEffect, useState } from 'react';
import { createContext } from 'react';
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api';
import polkadotConfig from './json/polkadot-config.json';
import { toast } from 'react-toastify';

const AppContext = createContext({
  api: null,
  deriveAcc: null,
  showToast: (status, id, FinalizedText, doAfter, callToastSuccess = true, events) => { },
  userInfo: {},
  userWalletPolkadot: "",
  userSigner: null,
  PolkadotLoggedIn: false,
  EasyToast: (message, type, UpdateType = false, ToastId = "") => { },
  GetAllDaos: async () => { },
  GetAllJoined: async () => { },
  getUserInfoById: async(userid) => { },
  updateCurrentUser: () => { }
});

export function PolkadotProvider({ children }) {
  const [api, setApi] = useState();
  const [deriveAcc, setDeriveAcc] = useState(null)
  const [PolkadotLoggedIn, setPolkadotLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState({})
  const [userWalletPolkadot, setUserWalletPolkadot] = useState("")
  const [userSigner, setUserSigner] = useState("")

  async function showToast(status, id, FinalizedText, doAfter, callToastSuccess = true, events) {

    if (status.isInBlock) {
      toast.update(id, { render: "Transaction In block...", isLoading: true });

    } else if (status.isFinalized) {
      if (callToastSuccess)
        toast.update(id, {
          render: FinalizedText, type: "success", isLoading: false, autoClose: 1000,
          closeButton: true,
          closeOnClick: true,
          draggable: true
        });
      doAfter(events);
    }
  }

  async function getUserInfoById(userid) {
    if (api) {
      return await api.query.users.userById(userid);
    } else {
      return {};
    }
  }
  async function EasyToast(message, type, UpdateType = false, ToastId = "") {

    if (UpdateType) {
      toast.update(ToastId, {
        render: message, type: type, isLoading: false,
        autoClose: 1000,
        closeButton: true,
        closeOnClick: true,
        draggable: true
      });
    }
  }

  async function updateCurrentUser() {
    const { web3Enable, web3Accounts, web3FromAddress } = require('@polkadot/extension-dapp');

    setPolkadotLoggedIn(true);
    await web3Enable('PlanetDAO');
    let wallet = (await web3Accounts())[0];
    const injector = await web3FromAddress(wallet.address);

    setUserSigner(injector.signer);

    setUserWalletPolkadot(wallet.address)
    window.signerAddress = wallet.address;
  }

  useEffect(() => {
    (async function () {
      try {
        const wsProvider = new WsProvider(polkadotConfig.chain_rpc);
        const _api = await ApiPromise.create({ provider: wsProvider });
        await _api.isReady;

        setApi(_api);

        const keyring = new Keyring({ type: 'sr25519' });
        const newPair = keyring.addFromUri(polkadotConfig.derive_acc);
        setDeriveAcc(newPair)



        if (window.localStorage.getItem('loggedin') == "true") {

          let userid = window.localStorage.getItem('user_id');
          window.userid = userid;
          const userInformation = await _api.query.users.userById(userid);
          setUserInfo(userInformation);

          if (window.localStorage.getItem('login-type') == "polkadot") {
            updateCurrentUser()

          }
        }
        console.log("Done")
      } catch (e) {

      }

    })();
  }, [])

  async function InsertData(totalDAOCount, allDAOs, prefix) {
    const arr = [];
    for (let i = 0; i < totalDAOCount; i++) {
      let object = "";
      let recievewallet = "";
      if (prefix == "_m") {
        object = JSON.parse(allDAOs[i]);
      } else {
        object = JSON.parse(allDAOs[i].daoUri.toString());
        recievewallet= allDAOs[i].daoWallet.toString();
      }

      if (object) {
        let user_info = await getUserInfoById(object.properties?.user_id?.description)
        arr.push({
          //Pushing all data into array
          id: i,
          daoId: prefix + i,
          Title: object.properties.Title.description,
          Start_Date: object.properties.Start_Date.description,
          user_info: user_info,
          user_id: object.properties?.user_id?.description,
          logo: object.properties.logo.description?.url,
          wallet: object.properties.wallet.description,
          recievewallet: recievewallet,
          recievetype: prefix == "_m"?"Polkadot":"EVM",
          SubsPrice: object.properties?.SubsPrice?.description
        });
      }
    }
    return arr;
  }

  async function fetchPolkadotDAOData() {

    //Fetching data from Parachain
    try {
      if (api) {
        let totalDAOCount = Number(await api._query.daos.daoIds());
        let totalDao = async () => {
          let arr = [];
          for (let i = 0; i < totalDAOCount; i++) {
            const element = await api._query.daos.daoById(i);
            let daoURI = element['__internal__raw'];

            arr.push(daoURI);
          }
          return arr;
        }

        let arr = InsertData(totalDAOCount, await totalDao(), "p_");
        return arr;
      }
    } catch (error) { }
    return [];
  }
  async function fetchContractDAOData() {

    //Fetching data from Smart contract
    try {
      if (window.contract) {
        const totalDao = await window.contract.get_all_daos(); //Getting total dao (Number)
        let totalDAOCount = Object.keys(totalDao).length;
        let arr = InsertData(totalDAOCount, totalDao, "m_");
        return arr;
      }
    } catch (error) { }

    return [];
  }
  async function GetAllDaos() {
    let arr = [];
    arr = arr.concat(await fetchPolkadotDAOData());
    arr = arr.concat(await fetchContractDAOData());
    return (arr);
  }


  async function fetchPolkadotJoinedData() {

    //Fetching data from Parachain
    try {
      if (api) {
        let totalJoinedCount = Number(await api._query.daos.joinedIds());
        let arr = [];
        for (let i = 0; i < totalJoinedCount; i++) {

          const element = await api._query.daos.joinedById(i);
          let newElm = {
            id: element['__internal__raw'].id.toString(),
            daoid: element['__internal__raw'].daoid.toString(),
            user_id: element['__internal__raw'].userId.toString(),
            joined_date: element['__internal__raw'].joinedDate.toString(),
          };
          arr.push(newElm);
        }
        return arr;
      }
    } catch (error) { }
    return [];
  }
  async function fetchContractJoinedData() {

    //Fetching data from Smart contract
    try {
      if (window.contract) {

        const totalJoined = await contract._join_ids();

        const arr = [];
        for (let i = 0; i < Number(totalJoined); i++) {
          const joined_dao = await contract._joined_person(i);
          arr.push(joined_dao)
        }


        return arr;
      }
    } catch (error) { }

    return [];
  }
  async function GetAllJoined() {
    let arr = [];
    arr = arr.concat(await fetchPolkadotJoinedData());
    arr = arr.concat(await fetchContractJoinedData());
    return (arr);
  }




  return <AppContext.Provider value={{ api: api, deriveAcc: deriveAcc, updateCurrentUser: updateCurrentUser, GetAllDaos: GetAllDaos, GetAllJoined: GetAllJoined, showToast: showToast, EasyToast: EasyToast, getUserInfoById: getUserInfoById, userWalletPolkadot: userWalletPolkadot, userSigner: userSigner, PolkadotLoggedIn: PolkadotLoggedIn, userInfo: userInfo }}>{children}</AppContext.Provider>;
}

export const usePolkadotContext = () => useContext(AppContext);

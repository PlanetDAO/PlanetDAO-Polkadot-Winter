import React, { useEffect, useState } from 'react';

import Head from 'next/head';
import useContract from '../../services/useContract';
import { Avatar, Button, IconButton, Tabs } from '@heathmont/moon-core-tw';
import { ChatChat, ChatCommentText, FilesGeneric, GenericHeart, GenericIdea, GenericUser, GenericUsers, ShopWallet, SoftwareLogOut, SportDarts } from '@heathmont/moon-icons-tw';
import SummaryPanel from '../../features/SummaryPanel';
import Card from '../../components/components/Card';
import Badge from '../../components/components/Badge';

import { usePolkadotContext } from '../../contexts/PolkadotContext';
import { useRouter } from 'next/router';

export default function Profile() {
  //Variables
  const { contract } = useContract();

  const { api, getUserInfoById, GetAllDaos,GetAllIdeas,GetAllGoals,GetAllJoined, GetAllVotes,GetAllUserDonations, PolkadotLoggedIn } = usePolkadotContext();
  const [Donated, setDonated] = useState([]);
  const [UserBadges, setUserBadges] = useState({
    dao: false,
    joined: false,
    goal: false,
    ideas: false,
    vote: false,
    donation: false,
    comment: false,
    reply: false
  });

  const [TotalRead, setTotalRead] = useState(0);
  const [Replied, setReplied] = useState(0);
  const [UserInfo, setUserInfo] = useState({});
  const [Daos, setDaos] = useState([]);
  const [Ideas, setIdeas] = useState([]);
  const [DontatedIdeas, setDontatedIdeas] = useState([]);
  const [RepliesIdeas, setRepliesIdeas] = useState([]);
  const [AllMessages, setAllMessages] = useState([]);
  const [userid, setUserid] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loggedUser, setLoggedUser] = useState(false);
  const [signerAddress, setSignerAddress] = useState('');
  const [stats, setStats] = useState({});

  const router = useRouter();

  useEffect(() => {
    fetchContractData();
  }, [contract, api]);

  async function fetchContractData() {
    setLoading(true);
    let user_id = Number(router.query.address);
    setSignerAddress(window.signerAddress);
    setUserid(user_id);
    if (!contract || !api) return false;
    if (user_id == window.userid) setLoggedUser(true);
    let user_info = await getUserInfoById(user_id);
    setUserInfo(user_info);
    //Fetching data from Smart contract
    let allDaos = await GetAllDaos();
    let allJoined = await GetAllJoined();
    let allGoals = await GetAllGoals();
    let allIdeas = await GetAllIdeas();
    let allVotes = await GetAllVotes();
    let allDonations = await GetAllUserDonations();

    // let donated = Number(await contract._donated(Number(user_id))) / 1e18;
    let allBadges = UserBadges;

    let total_read = 0;
    let _message_read_ids = await contract._message_read_ids();
    for (let i = 0; i < _message_read_ids; i++) {
      let ReadURI = await contract.all_read_messages(i);
      if (ReadURI.wallet == user_id) {
        total_read += 1;
      }
    }



    let founddao = [];
    for (let i = 0; i < allDaos.length; i++) {
      let dao_info = allDaos[i];
      if (dao_info.user_id == user_id) {
        dao_info.id = i;
        let goal = allGoals.filter(e=>e.daoId == dao_info.daoId);
        dao_info.goals = goal;

        founddao.push(dao_info);
      }
    }
    founddao.sort(function (a, b) {
      return b.goals.length - a.goals.length;
    });

   
    let foundidea= allIdeas.filter(e=>Number(e.user_id)==Number(user_id));

    foundidea.sort(function (a, b) {
      return b.votes - a.votes;
    });

    let foundGoals = allGoals.filter((e) => Number(e.UserId)==Number(user_id));
    let donated =  allDonations[user_id.toString()];

    allBadges['dao'] = founddao.length > 0 ? true : false;
    allBadges['joined'] = allJoined.filter((e) => Number(e.user_id)==Number(user_id)).length > 0 ? true : false;
    allBadges['goal'] = foundGoals.length > 0 ? true : false;
    allBadges['ideas'] = foundidea.length > 0 ? true : false;
    allBadges['vote'] = allVotes.filter((e) => Number(e.user_id)==Number(user_id)).length > 0 ? true : false;
    allBadges['donation'] = donated> 0 ? true : false;


    let _donations_ids = await contract._donations_ids();
    let ideasURIS = [];
    for (let i = 0; i < _donations_ids; i++) {
      let donationURI = await contract._donations(i);
      if (donationURI.userid == user_id) {
        let existsIdea = ideasURIS.findIndex((e) => e.id == Number(donationURI.ideas_id));
        if (existsIdea != -1) {
          ideasURIS[existsIdea].donation += Number(donationURI.donation) / 1e18;
          continue;
        }
        let ideaURI = JSON.parse((await contract._ideas_uris(Number(donationURI.ideas_id))).ideas_uri);
        ideaURI.donation = Number(donationURI.donation) / 1e18;
        ideaURI.id = Number(donationURI.ideas_id);
        ideasURIS.push(ideaURI);
      }
    }
    let allMessages = [];

    let ideasReplied = 0;
    let MessagesIdeasURIS = [];
    let _message_ids = await window.contract._message_ids();
    for (let i = 0; i < _message_ids; i++) {
      let messageURI = await window.contract.all_messages(i);

      if (JSON.parse(messageURI.message).userid == user_id) {
        ideasReplied += 1;
        let ideaURI = JSON.parse((await window.contract._ideas_uris(Number(messageURI.ideas_id))).ideas_uri);

        let parsed_message = JSON.parse(messageURI.message);
        parsed_message.idea = ideaURI;

        allMessages.push(parsed_message);

        let existsIdea = MessagesIdeasURIS.findIndex((e) => e.id == Number(messageURI.ideas_id));
        if (existsIdea != -1) {
          MessagesIdeasURIS[existsIdea].replied += 1;
          continue;
        }

        ideaURI.replied = 1;
        ideaURI.id = Number(messageURI.ideas_id);
        MessagesIdeasURIS.push(ideaURI);
      }
    }

    // let _reply_ids = await contract._reply_ids();
    // for (let i = 0; i < _reply_ids; i++) {
    // 	let repliesURI = await contract.all_replies(i);
    // 	if (JSON.parse(repliesURI.message).userid == user_id) {
    // 		ideasReplied += 1;
    // 		let ideaURI = JSON.parse((await window.contract._ideas_uris(Number(repliesURI.ideas_id))).ideas_uri);

    // 		let parsed_rplied = JSON.parse(repliesURI.message);
    // 		parsed_rplied.idea = ideaURI;
    // 		allMessages.push(parsed_rplied);

    // 		let existsIdea = MessagesIdeasURIS.findIndex(e => e.id == Number(repliesURI.ideas_id));
    // 		if (existsIdea != -1) {
    // 			MessagesIdeasURIS[existsIdea].replied += 1;
    // 			continue;
    // 		}

    // 		ideaURI.replied = 1;
    // 		ideaURI.id = Number(repliesURI.ideas_id);
    // 		MessagesIdeasURIS.push(ideaURI);
    // 	}
    // }

    setReplied(ideasReplied);
    setDonated(donated);
    setTotalRead(total_read);
    setDaos(founddao);
    setIdeas(foundidea);
    setDontatedIdeas(ideasURIS);
    setRepliesIdeas(MessagesIdeasURIS);
    setUserBadges(allBadges);

    setStats({
      daosCreated: founddao.length,
      goalsCreated: foundGoals.length,      
      ideasCreated: foundidea.length,
      donated:donated
    });

    setAllMessages(allMessages);

    setLoading(false);
  }

  function logout() {
    window.localStorage.setItem('loggedin', '');
    window.localStorage.setItem('login-type', '');
    window.location.href = '/';
  }

  const BadgesPanel = () => (
    <div className="badge-group-list">
      <Badge icon={<GenericUser />} label="Basic" description="All essential community functions" granted />
      <Badge icon={<ChatChat />} label="First reply" description="Replied to a message" granted={UserBadges.reply} />
      <Badge icon={<GenericUsers />} label="First join" description="Created a DAO community" granted={UserBadges.dao} />
      <Badge icon={<GenericUsers />} label="First community" description="Joined a DAO community" granted={UserBadges.joined} />
      <Badge icon={<GenericIdea />} label="First idea" description="Created an idea" granted={UserBadges.ideas} />
      <Badge icon={<GenericHeart />} label="First vote" description="Voted on an idea" granted={UserBadges.vote} />
      <Badge icon={<ShopWallet />} label="First donation" description="Donated to an idea" granted={UserBadges.donation} />
      <Badge icon={<SportDarts />} label="First goal" description="Created a goal" granted={UserBadges.goal} />
      <Badge icon={<ChatCommentText />} label="First comment" description="Commented on an idea" granted={UserBadges.comment} />
    </div>
  );

  return (
    <>
      <Head>
        <title>Profile</title>
        <meta name="description" content="Profile" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`gap-8 flex flex-col w-full bg-gohan pt-10 border-beerus border`}>
        <div className="container flex w-full justify-between relative">
          <div className="flex gap-2 items-center">
            <div className="relative">
              <Avatar className="rounded-full border border-beerus bg-gohan text-moon-80 h-20 w-20" imageUrl={'https://' + UserInfo?.imgIpfs?.toString() + '.ipfs.nftstorage.link'} />
              <IconButton className="absolute right-0 bottom-0 rounded-moon-i-sm" size="xs" icon={<FilesGeneric className="text-gohan" color="#ffff" />} onClick={null}></IconButton>
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="font-bold text-moon-32 text-piccolo">{UserInfo?.fullName?.toString()}</h1>
              <h3 className="text-trunks">{signerAddress}</h3>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {loggedUser ? (
              <Button variant="secondary" iconLeft={<SoftwareLogOut />} onClick={logout}>
                Log out
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="container">
          <Tabs selectedIndex={tabIndex} onChange={setTabIndex}>
            <Tabs.List>
              <Tabs.Tab>Summary</Tabs.Tab>
              <Tabs.Tab>Badges</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </div>
      </div>
      <div className="container py-10">
        <Card className="min-h-[556px]">
          {tabIndex === 0 && <SummaryPanel stats={stats} />}
          {tabIndex === 1 && <BadgesPanel />}
        </Card>
      </div>
    </>
  );
}

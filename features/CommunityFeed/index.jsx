import ActivityCard from '../../components/components/ActivityCard';
import { useEffect, useState } from 'react';
import useContract from '../../services/useContract';
import { sortDateDesc } from '../../utils/sort-date';
import AddPostCard from '../../components/components/AddPostCard';
import CreatePostModal from '../CreatePostModal';
import { usePolkadotContext } from '../../contexts/PolkadotContext';

const CommunityFeed = ({ communityName }) => {
  const [loading, setLoading] = useState(false);
  const [Items, setItems] = useState([]);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [userName, setUserName] = useState('');
  const { contract } = useContract();
  const [showPostModal, setShowPostModal] = useState(false);
  const { userInfo } = usePolkadotContext();

  async function fetchContractData() {
    setLoading(true);

    try {
      if (contract) {
        const totalFeeds = await contract._feed_ids();
        const arr = [];

        for (let i = 0; i < Number(totalFeeds); i++) {
          const feed = await contract._feeds(i);
          arr.push({
            date: new Date(Number(feed.date) * 1000),
            type: feed.Type,
            data: JSON.parse(feed.data)
          });
        }

        setItems(sortDateDesc(arr, 'date'));

        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
    }
  }

  function closeShowPostModal(event) {
    if (event) {
      setShowPostModal(false);
    }
  }

  useEffect(() => {
    setAvatarUrl('https://' + userInfo.imgIpfs + '.ipfs.nftstorage.link');
    setUserName(userInfo.fullName);
  }, [userInfo]);

  useEffect(() => {
    fetchContractData();
  }, [contract]);

  return (
    <div className="flex flex-col gap-2 w-full items-center pb-10 min-w-[540px]">
      <AddPostCard avatarUrl={avatarUrl} onClick={() => setShowPostModal(true)} />
      {Items.map((item, index) => (
        <ActivityCard key={index} old_date={item.date} type={item.type} data={item.data}></ActivityCard>
      ))}
      <CreatePostModal onClose={closeShowPostModal} show={showPostModal} avatarUrl={avatarUrl} userName={userName} communityName={communityName} />
    </div>
  );
};

export default CommunityFeed;

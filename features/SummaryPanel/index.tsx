import { Tabs } from '@heathmont/moon-core-tw';
import Stats, { ProfileStats } from './Stats';
import DAOCard from '../../components/components/DaoCard';
import GoalCard from '../../components/components/GoalCard';
import IdeaCard from '../../components/components/IdeaCard';
import { useEffect, useState } from 'react';
import useEnvironment from '../../services/useEnvironment';
import { Dao } from '../../data-model/dao';
import { JOINED } from '../../data-model/joined';
import useContract from '../../services/useContract';
import { usePolkadotContext } from '../../contexts/PolkadotContext';

const mockGoals = [
  {
    Title: 'Improve student lives',
    budget: 120
  }
];

const mockIdeas = [
  {
    Title: 'Free WiFi for all students'
  }
] as any[];

const SummaryPanel = ({ stats }: { stats: ProfileStats }) => {
  const [currency, setCurrency] = useState('');
  const { api, GetAllDaos, GetAllJoined } = usePolkadotContext();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const { contract } = useContract();

  useEffect(() => {
    setCurrency(useEnvironment.getCurrency());
    fetchContractData();
  }, [contract, api]);

  async function fetchContractData() {
    setLoading(true);
    //Fetching data from Smart contract
    try {
      if (contract && api) {
        let allDaos = (await GetAllDaos()) as any as Dao[];
        let allJoined = (await GetAllJoined()) as any as JOINED[];

        const arrList = [];

        allJoined.forEach((joined_dao) => {
          let foundDao = (allDaos as any).filter((e) => e?.daoId == joined_dao.daoId.toString());
          if (joined_dao.user_id.toString() == (window as any).userid.toString() && foundDao.length > 0) {
            arrList.push(foundDao[0]);
          }
        });

        setList(arrList.reverse());
      }
    } catch (error) {}

    setLoading(false);
  }

  return (
    <div className="w-full flex flex-col gap-10">
      <Stats stats={stats} currency={currency} />
      <div className="flex flex-col gap-5">
        <Tabs>
          <Tabs.List>
            <Tabs.Pill className="moon-selected:bg-piccolo moon-selected:text-gohan">My communities</Tabs.Pill>
            <Tabs.Pill className="moon-selected:bg-piccolo moon-selected:text-gohan">My goals</Tabs.Pill>
            <Tabs.Pill className="moon-selected:bg-piccolo moon-selected:text-gohan">My ideas</Tabs.Pill>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel>
              {list.map((dao, index) => (
                <DAOCard key={index} item={dao} hasJoined className="shadow-none border border-beerus" />
              ))}
            </Tabs.Panel>
            <Tabs.Panel>
              {mockGoals.map((goal, index) => (
                <GoalCard key={index} item={goal} preview className="shadow-none border border-beerus" />
              ))}
            </Tabs.Panel>
            <Tabs.Panel>
              {mockIdeas.map((idea, index) => (
                <IdeaCard key={index} item={idea} preview className="shadow-none border border-beerus" />
              ))}
            </Tabs.Panel>
          </Tabs.Panels>
        </Tabs>
      </div>
    </div>
  );
};

export default SummaryPanel;

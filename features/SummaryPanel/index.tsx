import { Tabs } from '@heathmont/moon-core-tw';
import Stats, { ProfileStats } from './Stats';
import DAOCard from '../../components/components/DaoCard';
import GoalCard from '../../components/components/GoalCard';
import IdeaCard from '../../components/components/IdeaCard';

const mockDaos = [
  {
    Title: 'Harvard University',
    SubsPrice: 0.001
  }
] as any[];

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
  return (
    <div className="w-full flex flex-col gap-10">
      <Stats stats={stats} />
      <div className="flex flex-col gap-5">
        <Tabs>
          <Tabs.List>
            <Tabs.Pill className="moon-selected:bg-piccolo moon-selected:text-gohan">My communities</Tabs.Pill>
            <Tabs.Pill className="moon-selected:bg-piccolo moon-selected:text-gohan">My goals</Tabs.Pill>
            <Tabs.Pill className="moon-selected:bg-piccolo moon-selected:text-gohan">My ideas</Tabs.Pill>
          </Tabs.List>
          <Tabs.Panels>
            <Tabs.Panel>
              {mockDaos.map((dao, index) => (
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

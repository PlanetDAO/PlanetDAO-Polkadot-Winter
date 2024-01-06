import ProfileStat from '../../components/components/ProfileStat';

const Stats = () => (
  <div className="flex flex-col gap-2 w-full">
    <div className="flex w-full gap-2">
      <ProfileStat value={1} label="DAOs created" />
      <ProfileStat value={1} label="Goals created" />
      <ProfileStat value={1} label="Ideas created" />
      <ProfileStat value={1} label="Comments created" />
      <ProfileStat value={1} label="Comments received" />
    </div>
    <div className="flex w-full gap-2">
      <ProfileStat value={`${200.32} DOT`} label="Donations received" />
      <ProfileStat value={`${35.5} DOT`} label="Donated" />
    </div>
  </div>
);

export default Stats;

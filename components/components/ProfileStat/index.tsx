const ProfileStat = ({ value, label }) => (
  <div className="flex flex-col flex-1 gap-1 justify-center items-center bg-goku border border-beerus rounded-moon-i-xs p-4">
    <h4 className="text-hit text-moon-24 font-semibold">{value}</h4>
    <p>{label}</p>
  </div>
);

export default ProfileStat;

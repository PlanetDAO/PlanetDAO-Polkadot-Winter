const ProfileStat = ({ value, label, isCurrency = false }: { value: number; label: string; isCurrency?: boolean }) => (
  <div className="flex flex-col flex-1 gap-1 justify-center items-center bg-goku border border-beerus rounded-moon-i-xs p-4">
    <h4 className="text-hit text-moon-24 font-semibold">
      {value ? value : 0} {isCurrency && 'DOT'}
    </h4>
    <p className="text-center">{label}</p>
  </div>
);

export default ProfileStat;

import { Dropdown, MenuItem } from '@heathmont/moon-core-tw';
import Link from 'next/link';
import { Dao } from '../../../data-model/dao';

const CommunitySwitcher = ({ title, joinedCommunities }: { title: string; joinedCommunities: Dao[] }) => {
  return (
    <></>
    // <Dropdown value={null} onChange={null}>
    //   <Dropdown.Trigger>
    //     <h1 className="text-moon-32 font-bold">{title}</h1>{' '}
    //   </Dropdown.Trigger>

    //   <Dropdown.Options className="bg-gohan w-48 min-w-0">
    //     {joinedCommunities.map((community, index) => (
    //       <Dropdown.Option key={index}>
    //         <Link href={`/Profile/${community.daoId}`} passHref>
    //           <MenuItem>Go to my profile</MenuItem>
    //         </Link>
    //       </Dropdown.Option>
    //     ))}
    //   </Dropdown.Options>
    // </Dropdown>
  );
};

export default CommunitySwitcher;

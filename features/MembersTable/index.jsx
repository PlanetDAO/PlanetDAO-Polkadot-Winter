import { Tooltip } from '@heathmont/moon-core-tw';
import { GenericInfo } from '@heathmont/moon-icons-tw';
import { Table } from '@heathmont/moon-table-tw';
import { format } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { usePolkadotContext } from '../../contexts/PolkadotContext';
import { JOINED } from '../../data-model/joined';

const mockData = [
  { name: 'Steve thijssen', joinDate: new Date('2023-12-05'), votePower: 3, votesReceived: 36, commentsReceived: 15, donationsReceived: 2, donated: 2.40 },
  { name: 'Baha Uddin', joinDate: new Date('2023-12-24'), votePower: 2, votesReceived: 36, commentsReceived: 15, donationsReceived: 2, donated: 2.40 },
  { name: 'Arjen van Gaal', joinDate: new Date('2024-01-03'), votePower: 1, votesReceived: 36, commentsReceived: 15, donationsReceived: 2, donated: 2.40 },
  { name: 'Thomas Goethals', joinDate: new Date('2024-01-05'), votePower: 1, votesReceived: 36, commentsReceived: 15, donationsReceived: 2, donated: 2.40 }
];

const HeaderLabel = ({ children }) => <label className="flex items-center h-full">{children}</label>;

const MembersTable = ({daoId}) => {
  const {api,GetAllJoined,getUserInfoById} =  usePolkadotContext();
  const [Data,setData] = useState([])
  const columnsInitial = [
    {
      Header: <HeaderLabel>Name</HeaderLabel>,
      accessor: 'name'
    },
    {
      Header: <HeaderLabel>Join date</HeaderLabel>,
      accessor: 'joinDate'
    },
    {
      Header: (
        <HeaderLabel>
          Vote power level
          <Tooltip>
            <Tooltip.Trigger>
              <div className="">
                <GenericInfo className="ml-1" fontSize={16} />
              </div>
            </Tooltip.Trigger>
            <Tooltip.Content className="bg-gohan">
              This may need some explanation
              <Tooltip.Arrow className="bg-gohan" />
            </Tooltip.Content>
          </Tooltip>
        </HeaderLabel>
      ),
      accessor: 'votePower'
    },
    {
      Header: <HeaderLabel>Votes received</HeaderLabel>,
      accessor: 'votesReceived',
      width: 100
    },
    {
      Header: <HeaderLabel>Comments received</HeaderLabel>,
      accessor: 'commentsReceived',
      width: 100
    },
    {
      Header: <HeaderLabel>Donations received</HeaderLabel>,
      accessor: 'donationsReceived',
      width: 100
    }
  ];

  const formatData = (items) => items.map((item) => ({ name: item.name, joinDate: <span>{format(item.joinDate, 'dd MMM yyyy')}</span>, votePower: item.votePower, votesReceived: item.votesReceived, commentsReceived: item.commentsReceived, donationsReceived: <span>{item.donationsReceived} (DOT {item.donated})</span> }));

  const defaultColumn = useMemo(
    () => ({
      minWidth: 100,
      maxWidth: 300
    }),
    []
  );

  const columns = useMemo(() => columnsInitial, []);

    async function loadData(){
      if (api){
        let allJoined = (await GetAllJoined() ) ;
        let Members = [];
        for (let i = 0; i < allJoined.length; i++) {
          const element = allJoined[i];
          let userInfo = await getUserInfoById(element.user_id);
          let info = {
            name:userInfo?.fullName?.toString(),
            joinDate: element.joined_date,
            votePower:1,
            votesReceived:0,
            commentsReceived:0,
            donationsReceived:0,
            donated:0,
          };

          Members.push(info);
        }
      
        // let formattedData = formatData(Members);

        setData(Members);
      }
    }
    useEffect(()=>{
      loadData()
    },[])

  return (
    <>
      <Table columns={columns} rowSize="xl" data={Data} isSorting={true} defaultColumn={defaultColumn} width={800} defaultRowBackgroundColor="white" evenRowBackgroundColor="white" headerBackgroundColor="trunks" />
    </>
  );
};

export default MembersTable;

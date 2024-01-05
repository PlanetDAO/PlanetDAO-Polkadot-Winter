import { Tooltip } from '@heathmont/moon-core-tw';
import { GenericInfo } from '@heathmont/moon-icons-tw';
import { Table } from '@heathmont/moon-table-tw';
import { format } from 'date-fns';
import { useMemo } from 'react';

const mockData = [
  { name: 'Steve thijssen', joinDate: new Date('2023-12-05'), votePower: 3, votesReceived: 36, commentsReceived: 15, donationsReceived: 2 },
  { name: 'Baha Uddin', joinDate: new Date('2023-12-24'), votePower: 2, votesReceived: 36, commentsReceived: 15, donationsReceived: 2 },
  { name: 'Arjen van Gaal', joinDate: new Date('2024-01-03'), votePower: 1, votesReceived: 36, commentsReceived: 15, donationsReceived: 2 },
  { name: 'Thomas Goethals', joinDate: new Date('2024-01-05'), votePower: 1, votesReceived: 36, commentsReceived: 15, donationsReceived: 2 }
];

const HeaderLabel = ({ children }) => <label className="flex items-center h-full">{children}</label>;

const MembersTable = () => {
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

  const formatData = (items) => items.map((item) => ({ name: item.name, joinDate: <span>{format(item.joinDate, 'dd MMM yyyy')}</span>, votePower: item.votePower, votesReceived: item.votesReceived, commentsReceived: 15, donationsReceived: <span>{item.donationsReceived} (DOT 2.40)</span> }));

  const defaultColumn = useMemo(
    () => ({
      minWidth: 100,
      maxWidth: 300
    }),
    []
  );

  const columns = useMemo(() => columnsInitial, []);
  const data = useMemo(() => formatData(mockData), []);

  return (
    <>
      <Table columns={columns} rowSize="xl" data={data} isSorting={true} defaultColumn={defaultColumn} width={800} defaultRowBackgroundColor="white" evenRowBackgroundColor="white" headerBackgroundColor="trunks" />
    </>
  );
};

export default MembersTable;

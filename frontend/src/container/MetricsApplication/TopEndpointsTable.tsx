import { Button, Table, Tooltip } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { METRICS_PAGE_QUERY_PARAM } from 'constants/query';
import ROUTES from 'constants/routes';
import history from 'lib/history';
import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AppState } from 'store/reducers';
import { GlobalReducer } from 'types/reducer/globalTime';

function TopEndpointsTable(props: TopEndpointsTableProps): JSX.Element {
	const { minTime, maxTime } = useSelector<AppState, GlobalReducer>(
		(state) => state.globalTime,
	);

	const { data } = props;

	const params = useParams<{ servicename: string }>();

	const handleOnClick = (operation: string): void => {
		const urlParams = new URLSearchParams();
		const { servicename } = params;
		urlParams.set(
			METRICS_PAGE_QUERY_PARAM.startTime,
			(minTime / 1000000).toString(),
		);
		urlParams.set(
			METRICS_PAGE_QUERY_PARAM.endTime,
			(maxTime / 1000000).toString(),
		);

		history.push(
			`${
				ROUTES.TRACE
			}?${urlParams.toString()}&selected={"serviceName":["${servicename}"],"operation":["${operation}"]}&filterToFetchData=["duration","status","serviceName","operation"]&spanAggregateCurrentPage=1&selectedTags=[]&&isFilterExclude={"serviceName":false,"operation":false}&userSelectedFilter={"status":["error","ok"],"serviceName":["${servicename}"],"operation":["${operation}"]}&spanAggregateCurrentPage=1&spanAggregateOrder=ascend`,
		);
	};

	const columns: ColumnsType<DataProps> = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',

			// eslint-disable-next-line react/display-name
			render: (text: string): JSX.Element => (
				<Tooltip placement="topLeft" title={text}>
					<Button
						className="topEndpointsButton"
						type="link"
						onClick={(): void => handleOnClick(text)}
					>
						{text}
					</Button>
				</Tooltip>
			),
		},
		{
			title: 'P50  (in ms)',
			dataIndex: 'p50',
			key: 'p50',
			sorter: (a: DataProps, b: DataProps): number => a.p50 - b.p50,
			render: (value: number): string => (value / 1000000).toFixed(2),
		},
		{
			title: 'P95  (in ms)',
			dataIndex: 'p95',
			key: 'p95',
			sorter: (a: DataProps, b: DataProps): number => a.p95 - b.p95,
			render: (value: number): string => (value / 1000000).toFixed(2),
		},
		{
			title: 'P99  (in ms)',
			dataIndex: 'p99',
			key: 'p99',
			sorter: (a: DataProps, b: DataProps): number => a.p99 - b.p99,
			render: (value: number): string => (value / 1000000).toFixed(2),
		},
		{
			title: 'Number of Calls',
			dataIndex: 'numCalls',
			key: 'numCalls',
			sorter: (a: TopEndpointListItem, b: TopEndpointListItem): number =>
				a.numCalls - b.numCalls,
		},
	];

	return (
		<Table
			showHeader
			title={(): string => {
				return 'Top Endpoints';
			}}
			dataSource={data}
			columns={columns}
			pagination={false}
			rowKey="name"
		/>
	);
}

interface TopEndpointListItem {
	p50: number;
	p95: number;
	p99: number;
	numCalls: number;
	name: string;
}

type DataProps = TopEndpointListItem;

interface TopEndpointsTableProps {
	data: TopEndpointListItem[];
}

export default TopEndpointsTable;

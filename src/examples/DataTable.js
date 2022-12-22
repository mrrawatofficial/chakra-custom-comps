import { Link as RouterLink } from "react-router-dom";
import {
	Box,
	ButtonGroup,
	Container,
	Heading,
	IconButton,
	Input,
	Link,
	Spinner,
} from "@chakra-ui/react";
import MyTable, { selectable } from "../components/DataTable/MyTable";
import { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { FiEye, FiTrash2 } from "react-icons/fi";
import { BiEdit } from "react-icons/bi";

const DataTable = () => {
	const columnHelper = createColumnHelper();
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [pNo, setPNo] = useState(1);
	const [pageSize, setPageSize] = useState("10");
	const [totalPages, setTotalPages] = useState(0);

	const columns = [
		selectable,
		columnHelper.accessor("id", {
			header: "ID",
			cell: (info) => info.getValue(),
			exportAble: true,
		}),
		columnHelper.accessor("name", {
			header: "Name",
			tooltip: true,
			exportAble: true,
		}),
		columnHelper.accessor("action", {
			header: "Action",
			exportAble: false,
			cell: (info) => {
				return (
					<ButtonGroup variant="solid" spacing={2}>
						<IconButton
							colorScheme="primary"
							aria-label="View"
							icon={<FiEye />}
							size="sm"
						/>
						<IconButton
							colorScheme="yellow"
							aria-label="View"
							icon={<BiEdit />}
							size="sm"
						/>
						<IconButton
							colorScheme="red"
							aria-label="Delete"
							icon={<FiTrash2 />}
							size="sm"
						/>
					</ButtonGroup>
				);
			},
		}),
	];
	const deleteRows = async (rows) => {
		const ids = rows.map((row) => row.original.id);
		console.log(ids);
	};
	const fetchData = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`http://localhost:8080/names?page=${pNo}&limit=${pageSize}`
			);
			const json = await response.json();
			if (json.status) {
				setData(json.data);
				setTotalPages(Math.ceil(json.count / +pageSize));
			} else {
				setData([]);
			}
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};

	useEffect(() => {
		fetchData();
	}, [pNo, pageSize]);
	return (
		<Container maxW="6xl" bg="blue.200" minH={"100vh"} p={2}>
			<Link as={RouterLink} to="/">
				Back
			</Link>
			<Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					Data Table
				</Heading>
				<MyTable
					columns={columns}
					data={data}
					loaderComponent={<Spinner />}
					isLoading={isLoading}
					exportFileName="users"
					multiRows={{
						show: true,
						handlemultiple: deleteRows,
					}}
					tableStyle={{
						variant: "simple",
						colorScheme: "primary",
						bg: "white",
						size: "sm",
					}}
					pagination={{
						totalPages,
						pageNo: pNo,
						pageSize,
						setPageSize,
						onChange: setPNo,
					}}
				/>
			</Box>
		</Container>
	);
};
export default DataTable;

export const DebouncedInput = ({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}) => {
	const [value, setValue] = useState(initialValue);

	useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value);
		}, debounce);

		return () => clearTimeout(timeout);
	}, [value, debounce, onChange]);

	return (
		<Input
			value={value}
			maxW={200}
			type="search"
			variant="outline"
			onChange={(e) => setValue(e.target.value)}
			focusBorderColor="primary.500"
			_light={{
				bg: "white",
			}}
			_dark={{
				bg: "gray.800",
				color: "white",
			}}
			{...props}
		/>
	);
};

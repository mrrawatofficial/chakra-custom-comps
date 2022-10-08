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
// import { AiOutlineCalendar } from "react-icons/ai";

const DataTable = () => {
	const columnHelper = createColumnHelper();
	const [data, setData] = useState([]);
	const [search, setSearch] = useState("");
	// const Filter = () => {
	// 	return (
	// 		<>
	// 			<IconButton
	// 				colorScheme="primary"
	// 				aria-label="Search database"
	// 				icon={<AiOutlineCalendar />}
	// 			/>
	// 			<IconButton
	// 				colorScheme="primary"
	// 				aria-label="Search database"
	// 				icon={<AiOutlineCalendar />}
	// 			/>
	// 		</>
	// 	);
	// };

	const columns = [
		selectable,
		columnHelper.accessor("id", {
			header: "ID",
			cell: (info) => info.getValue(),
			exportAble: true,
		}),
		columnHelper.accessor("title", {
			header: "Title",
			tooltip: true,
			exportAble: true,
		}),
		columnHelper.accessor("body", {
			header: "Body",
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
	// const columns = [
	// 	selectable,
	// 	columnHelper.accessor("id", {
	// 		header: "ID",
	// 		cell: (info) => info.getValue(),
	// 		exportAble: true,
	// 	}),
	// 	columnHelper.accessor("name", {
	// 		header: "Name",
	// 		cell: (info) => info.renderValue(),
	// 		tooltip: true,
	// 		exportAble: true,
	// 	}),
	// 	columnHelper.accessor("username", {
	// 		header: "User Name",
	// 		tooltip: true,
	// 		exportAble: true,
	// 	}),
	// 	columnHelper.accessor("email", {
	// 		header: "Email",
	// 		tooltip: true,
	// 		exportAble: true,
	// 	}),
	// 	columnHelper.accessor("phone", {
	// 		header: "Phone",
	// 		tooltip: true,
	// 		exportAble: true,
	// 	}),
	// 	columnHelper.accessor("website", {
	// 		header: "Website",
	// 		exportAble: true,
	// 	}),
	// 	// columnHelper.accessor("company", {
	// 	// 	header: "Company Name",
	// 	// 	cell: (info) => `${info.getValue().name}`,
	// 	// 	tooltip: true,
	// 	// 	exportAble: true,
	// 	// }),
	// 	// columnHelper.accessor("company", {
	// 	// 	id: "companyCatchPhrase",
	// 	// 	header: "Company Catch Phrase",
	// 	// 	cell: (info) => `${info.getValue().catchPhrase}`,
	// 	// 	tooltip: true,
	// 	// 	noOfLines: 1,
	// 	// 	exportAble: true,
	// 	// }),
	// 	// columnHelper.accessor("company", {
	// 	// 	id: "companyBs",
	// 	// 	header: "Company Bs",
	// 	// 	cell: (info) => `${info.getValue().bs}`,
	// 	// 	tooltip: true,
	// 	// 	exportAble: true,
	// 	// }),
	// 	columnHelper.accessor("action", {
	// 		header: "Action",
	// 		exportAble: false,
	// 		cell: (info) => {
	// 			return (
	// 				<ButtonGroup variant="solid" spacing={2}>
	// 					<IconButton
	// 						colorScheme="primary"
	// 						aria-label="View"
	// 						icon={<FiEye />}
	// 					/>
	// 					<IconButton
	// 						colorScheme="yellow"
	// 						aria-label="View"
	// 						icon={<BiEdit />}
	// 					/>
	// 					<IconButton
	// 						colorScheme="red"
	// 						aria-label="Delete"
	// 						icon={<FiTrash2 />}
	// 					/>
	// 				</ButtonGroup>
	// 			);
	// 		},
	// 	}),
	// ];
	const deleteRows = async (rows) => {
		const ids = rows.map((row) => row.original.id);
		console.log(ids);
	};

	const handleFilter = async (value) => {
		if (value) {
			setSearch(String(value));
			const filteredItems = data.filter((d1) => {
				return (
					d1.title?.toLowerCase().includes(value?.toLowerCase()) ||
					d1.body?.toLowerCase().includes(value?.toLowerCase())
				);
			});
			setData(filteredItems);
		} else {
			fetchData();
		}
	};
	const fetchData = async () => {
		const response = await fetch(
			"https://jsonplaceholder.typicode.com/posts"
			// "https://jsonplaceholder.typicode.com/users"
		);
		const json = await response.json();
		setData(json);
	};

	useEffect(() => {
		fetchData();
	}, []);
	return (
		<Container maxW="6xl" bg="blue.200" minH={"100vh"} p={2}>
			<Link as={RouterLink} to="/">
				Back
			</Link>
			<Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					Data Table
				</Heading>
				<DebouncedInput
					size={"sm"}
					value={search ?? ""}
					onChange={handleFilter}
					placeholder="Search..."
				/>
				<MyTable
					columns={columns}
					data={data}
					loaderComponent={<Spinner />}
					// filterComponent={<Filter />}
					// exportExcel={false}
					// exportPdf={true}
					exportFileName="users"
					deleteRows={deleteRows}
					tableStyle={{
						variant: "simple",
						colorScheme: "primary",
						bg: "white",
						size: "sm",
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

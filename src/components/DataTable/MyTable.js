import {
	Box,
	Button,
	ButtonGroup,
	Center,
	Checkbox,
	HStack,
	Input,
	Menu,
	MenuButton,
	MenuList,
	Select,
	Stack,
	Table,
	TableContainer,
	Tbody,
	Td,
	Text,
	Tfoot,
	Th,
	Thead,
	Tooltip,
	Tr,
	VStack,
} from "@chakra-ui/react";
import {
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useEffect, useMemo, useRef, useState } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MdDeleteOutline } from "react-icons/md";
import { VscFilePdf } from "react-icons/vsc";
import { FaFileCsv } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";
import { useLayoutEffect } from "react";

const fuzzyFilter = (row, columnId, value, addMeta) => {
	const itemRank = rankItem(row.getValue(columnId), value);
	addMeta({
		itemRank,
	});
	return itemRank.passed;
};

const MyTable = ({
	data,
	columns,
	tableStyle,
	sort = true,
	colVis = true,
	search = true,
	showPageSize = true,
	loaderComponent = null,
	noDataComponent = null,
	filterComponent = null,
	multiRows,
	exportExcel = true,
	exportFileName = "export",
	exportPdf = true,
	customFilter,
	exportHeader = 0,
	pdfTitle,
	footer = false,
	customExData = null,
	customExHeader = null,
	isLoading = false,
	pagination,
}) => {
	const [sorting, setSorting] = useState([]);
	const [columnVisibility, setColumnVisibility] = useState({});
	const [globalFilter, setGlobalFilter] = useState("");
	const [rowSelection, setRowSelection] = useState({});
	const [exportData, setExportData] = useState({ headers: [] });

	const table = useReactTable({
		data: data,
		columns,
		state: {
			sorting,
			columnVisibility,
			globalFilter,
			rowSelection,
		},
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: fuzzyFilter,
		getFilteredRowModel: getFilteredRowModel(),
		onRowSelectionChange: setRowSelection,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		getPaginationRowModel: getPaginationRowModel(),
	});
	const exportToPDF = () => {
		const unit = "pt";
		const size = "A4";
		const orientation = "portrait";
		const doc = new jsPDF(orientation, unit, size);
		doc.setFontSize(15);
		const title = pdfTitle
			? pdfTitle.toUpperCase()
			: exportFileName.toUpperCase();
		const headerData = customExHeader || exportData.headers[exportHeader];
		let content = {
			startY: 50,
			body: customExData || data,
			columns: headerData.map((elt) => {
				return {
					title: elt.label,
					dataKey: elt.key,
				};
			}),
		};
		doc.text(title, 40, 40);
		doc.autoTable(content);
		doc.save(`${exportFileName}.pdf`);
	};
	useLayoutEffect(() => {
		let headers = table.getHeaderGroups().map((headerGroup) => {
			return headerGroup.headers
				.filter((exportable) => exportable.column.columnDef.exportAble)
				.map((header) => {
					return {
						label: header.column.columnDef.header,
						key: header.id,
					};
				});
		});
		setExportData({
			headers: headers,
		});
	}, [table]);
	return (
		<>
			<Stack
				className="table-toolbar"
				justifyContent={"space-between"}
				direction={"row"}
				wrap={"wrap"}
				my={2}
				gap={2}
			>
				<Stack flexGrow={1} direction={["column", "row"]}>
					{showPageSize && (
						<Select
							value={pagination.pageSize}
							maxW={200}
							size={tableStyle.size}
							borderColor={"gray.500"}
							focusBorderColor={"primary.500"}
							onChange={(e) => {
								pagination.setPageSize(e.target.value);
							}}
							_dark={{
								color: "white",
							}}
						>
							{["10", "20", "30", "50", "100"].map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									Show {pageSize}
								</option>
							))}
						</Select>
					)}
					{colVis && (
						<Menu closeOnSelect={false}>
							<MenuButton
								as={Button}
								colorScheme="primary"
								leftIcon={<IoEyeOutline />}
								size={tableStyle.size}
								maxW={200}
							>
								Show Columns
							</MenuButton>
							<MenuList minWidth="200px" shadow={"2xl"}>
								<VStack p={2} alignItems={"flex-start"}>
									{table.getAllLeafColumns().map((column) => {
										return (
											<Checkbox
												key={column.id}
												disabled={
													column.id.toLowerCase() === "id" ||
													column.id.toLowerCase() === "action"
												}
												display={
													column.id.toLowerCase() === "select" ? "none" : "flex"
												}
												colorScheme="primary"
												defaultChecked={column.getIsVisible()}
												onChange={column.getToggleVisibilityHandler()}
												_dark={{
													color: "white",
												}}
											>
												{column.id}
											</Checkbox>
										);
									})}
								</VStack>
							</MenuList>
						</Menu>
					)}
					{filterComponent && filterComponent}
					{exportExcel && (
						<Button
							as={CSVLink}
							headers={customExHeader || exportData.headers[exportHeader]}
							data={customExData || data}
							filename={`${exportFileName}.csv`}
							leftIcon={<FaFileCsv />}
							colorScheme="primary"
							size={tableStyle.size}
							maxW={200}
						>
							Export Csv
						</Button>
					)}
					{exportPdf && (
						<Button
							colorScheme="secondary"
							leftIcon={<VscFilePdf />}
							onClick={() => exportToPDF()}
							size={tableStyle.size}
						>
							Export Pdf
						</Button>
					)}
				</Stack>
				<HStack marginInlineStart={"0!important"}>
					{customFilter && customFilter}
					{Object.keys(rowSelection).length > 0 && (
						<Button
							colorScheme={multiRows?.bg ? multiRows?.bg : "red"}
							leftIcon={multiRows?.icon ? multiRows?.icon : <MdDeleteOutline />}
							maxW={250}
							onClick={() => {
								multiRows.show
									? multiRows?.handlemultiple(
											table.getSelectedRowModel().flatRows
									  )
									: console.log("No function declared for multiple select");
							}}
							size={tableStyle.size}
						>
							{multiRows?.text ? multiRows?.text : "Delete"}{" "}
							{Object.keys(rowSelection).length} Rows
						</Button>
					)}
					{search && (
						<DebouncedInput
							size={tableStyle.size}
							value={globalFilter ?? ""}
							onChange={(value) => setGlobalFilter(String(value))}
							placeholder="Search..."
						/>
					)}
				</HStack>
			</Stack>
			{!isLoading && data.length <= 0 ? (
				<Center bg="red.500" py={3}>
					{noDataComponent || "No Data Found"}
				</Center>
			) : (
				<TableContainer whiteSpace="normal">
					{/* {isLoading ? (
						<Center py={3}>{loaderComponent || "Loading data..."}</Center>
					) : ( */}
					<Table
						variant={tableStyle.variant || "simple"}
						colorScheme={tableStyle.colorScheme || "primary"}
						size={tableStyle.size || "md"}
						_light={{
							bg: tableStyle.bg || "white",
						}}
						_dark={{
							bg: "gray.600",
							color: "white",
						}}
						pos={"relative"}
					>
						<Thead
							_light={{
								bg: tableStyle.headBg || "white",
							}}
							_dark={{
								bg: "gray.900",
							}}
						>
							{table.getHeaderGroups().map((headerGroup) => (
								<Tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => (
										<Th
											key={header.id}
											whiteSpace="nowrap"
											colSpan={header.colSpan}
											cursor="pointer"
											borderWidth={2}
											borderColor="gray.300"
											backgroundColor={"gray.200"}
											paddingBlock={tableStyle.headPadding || 4}
											textAlign="center"
											width={
												header.column.columnDef.width &&
												header.column.columnDef.width
											}
											{...{
												onClick: sort
													? header.column.getToggleSortingHandler()
													: () => {},
											}}
										>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
											{{
												asc: " 🔼",
												desc: " 🔽",
											}[header.column.getIsSorted()] ?? null}
										</Th>
									))}
								</Tr>
							))}
						</Thead>
						<Tbody>
							{table.getRowModel().rows.map((row) => (
								<Tr
									key={row.id}
									_light={{
										bg: row.getIsSelected() ? "gray.300" : tableStyle.bg,
									}}
									_dark={{
										bg: row.getIsSelected() ? "gray.600" : "gray.800",
									}}
								>
									{row.getVisibleCells().map((cell) => (
										<Td
											key={cell.id}
											isNumeric={cell.column.columnDef.isNumeric}
											borderWidth={2}
											borderColor="gray.300"
											textAlign="center"
										>
											{cell.column.columnDef.tooltip ? (
												<Tooltip
													label={flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
													hasArrow
													arrowSize={15}
												>
													<Text
														noOfLines={cell.column.columnDef.noOfLines || 1}
														as={Box}
													>
														{flexRender(
															cell.column.columnDef.cell,
															cell.getContext()
														)}
													</Text>
												</Tooltip>
											) : (
												flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)
											)}
											{/* {} */}
										</Td>
									))}
								</Tr>
							))}
						</Tbody>
						{isLoading && (
							<Center
								pos={"absolute"}
								top={0}
								left={0}
								py={3}
								w={"full"}
								h="full"
								bg="whiteAlpha.800"
							>
								{loaderComponent || "Loading data..."}
							</Center>
						)}
						{footer && (
							<Tfoot>
								{table.getFooterGroups().map((footerGroup) => (
									<Tr key={footerGroup.id}>
										{footerGroup.headers.map((header) => (
											<Th key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.footer,
															header.getContext()
													  )}
											</Th>
										))}
									</Tr>
								))}
							</Tfoot>
						)}
					</Table>
					{/* )} */}
				</TableContainer>
			)}
			<Box
				className="table-footer"
				display="flex"
				justifyContent={
					Object.keys(rowSelection).length > 0 ? "space-between" : "flex-end"
				}
				alignItems="center"
				gap={5}
				my={2}
			>
				{Object.keys(rowSelection).length > 0 && (
					<Text as="strong">
						{Object.keys(rowSelection).length} of{" "}
						{table.getPreFilteredRowModel().rows.length} Rows Selected
					</Text>
				)}
				<Pagination
					table={table}
					tableStyle={tableStyle}
					pagination={pagination}
				/>
			</Box>
		</>
	);
};
export default MyTable;

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

export const selectable = {
	id: "select",
	exportAble: false,
	header: ({ table }) => (
		<IndeterminateCheckbox
			{...{
				isChecked: table.getIsAllPageRowsSelected(),
				isIndeterminate: table.getIsSomeRowsSelected(),
				onChange: table.getToggleAllPageRowsSelectedHandler(),
			}}
		/>
	),
	cell: ({ row }) => (
		<IndeterminateCheckbox
			value={row.original.id}
			{...{
				isChecked: row.getIsSelected(),
				isIndeterminate: row.getIsSomeSelected(),
				onChange: row.getToggleSelectedHandler(),
			}}
		/>
	),
};

export const IndeterminateCheckbox = ({ ...rest }) => {
	const ref = useRef(null);
	return (
		<>
			<Checkbox
				ref={ref}
				{...rest}
				colorScheme="primary"
				borderColor="gray.500"
			/>
		</>
	);
};

export const Pagination = ({ tableStyle, pagination }) => {
	return (
		<HStack spacing={5}>
			<HStack>
				<Text>Page</Text>
				<Text as={"strong"}>
					{pagination.pageNo} of {pagination.totalPages}
				</Text>
			</HStack>
			<ButtonGroup colorScheme="primary" isAttached>
				<Button
					borderRadius="0"
					size={tableStyle.size}
					colorScheme={"primary"}
					onClick={() => pagination.onChange(1)}
					disabled={pagination.pageNo === 1}
				>
					{"<<"}
				</Button>
				<Button
					disabled={pagination.pageNo === 1}
					borderRadius="0"
					size={tableStyle.size}
					colorScheme={"primary"}
					onClick={() => pagination.onChange(pagination.pageNo - 1)}
				>
					{"<"}
				</Button>

				{/* {Array(pagination.totalPages)
					.fill(1)
					.slice(0, 10)
					.map((pn, i) => (
						<Button
							key={i}
							borderRadius="0"
							size={tableStyle.size}
							colorScheme={
								pagination.pageNo === i + 1 ? "secondary" : "primary"
							}
							onClick={() => pagination.onChange(i + 1)}
						>
							{i + 1}
						</Button>
					))} */}
				<Button
					disabled={pagination.pageNo === pagination.totalPages}
					borderRadius="0"
					size={tableStyle.size}
					colorScheme={"primary"}
					onClick={() => pagination.onChange(pagination.pageNo + 1)}
				>
					{">"}
				</Button>
				<Button
					borderRadius="0"
					size={tableStyle.size}
					colorScheme={"primary"}
					onClick={() => pagination.onChange(pagination.totalPages)}
					disabled={pagination.pageNo === pagination.totalPages}
				>
					{">>"}
				</Button>
			</ButtonGroup>
		</HStack>
	);
};

// export const usePagination = ({
// 	totalCount,
// 	pageSize,
// 	siblingCount = 1,
// 	currentPage,
// }) => {
// 	const paginationRange = useMemo(() => {
// 		// Our implementation logic will go here
// 	}, [totalCount, pageSize, siblingCount, currentPage]);

// 	return paginationRange;
// };

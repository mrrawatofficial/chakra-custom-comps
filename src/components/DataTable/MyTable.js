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
import { useEffect, useRef, useState } from "react";
import { rankItem } from "@tanstack/match-sorter-utils";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { MdDeleteOutline } from "react-icons/md";
import { VscFilePdf } from "react-icons/vsc";
import { FaFileCsv } from "react-icons/fa";
import { IoEyeOutline } from "react-icons/io5";

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
	deleteRows,
	exportExcel = true,
	exportFileName = "export",
	exportPdf = true,
}) => {
	const [isLoading, setIsLoading] = useState(true);
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
		const title = exportFileName.toUpperCase() + " - DATA";
		let content = {
			startY: 50,
			body: data,
			columns: exportData.headers[0].map((elt) => {
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
	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [table.state]);
	useEffect(() => {
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
			>
				<HStack flexGrow={1}>
					{colVis && (
						<Menu closeOnSelect={false}>
							<MenuButton
								as={Button}
								colorScheme="primary"
								leftIcon={<IoEyeOutline />}
							>
								Show Columns
							</MenuButton>
							<MenuList minWidth="200px">
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
					{showPageSize && (
						<Select
							value={table.getState().pagination.pageSize}
							maxW={130}
							onChange={(e) => {
								table.setPageSize(Number(e.target.value));
							}}
							_dark={{
								color: "white",
							}}
						>
							{[10, 20, 30, 50, 100].map((pageSize) => (
								<option key={pageSize} value={pageSize}>
									Show {pageSize}
								</option>
							))}
						</Select>
					)}
					{exportExcel && (
						<Button
							as={CSVLink}
							headers={exportData.headers[0]}
							data={data}
							filename={`${exportFileName}.csv`}
							leftIcon={<FaFileCsv />}
							colorScheme="primary"
						>
							Export Csv
						</Button>
					)}
					{exportPdf && (
						<Button
							colorScheme="secondary"
							leftIcon={<VscFilePdf />}
							onClick={() => exportToPDF()}
						>
							Export Pdf
						</Button>
					)}
					{filterComponent && filterComponent}
				</HStack>
				<HStack>
					{Object.keys(rowSelection).length > 0 && (
						<Button
							colorScheme="red"
							leftIcon={<MdDeleteOutline />}
							onClick={() => {
								deleteRows
									? deleteRows(table.getSelectedRowModel().flatRows)
									: console.log("No deleteRows function");
							}}
						>
							Delete {Object.keys(rowSelection).length} Rows
						</Button>
					)}
					{search && (
						<DebouncedInput
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
					{isLoading ? (
						<Center>{loaderComponent || "Loading data..."}</Center>
					) : (
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
												paddingBlock={tableStyle.headPadding || 4}
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
						</Table>
					)}
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
				<HStack spacing={5}>
					<HStack>
						<Text>Page</Text>
						<Text as={"strong"}>
							{table.getState().pagination.pageIndex + 1} of{" "}
							{table.getPageCount()}
						</Text>
					</HStack>
					<ButtonGroup colorScheme="primary" isAttached>
						<Button
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							{"<<"}
						</Button>

						<Button
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							{"<"}
						</Button>

						<Button
							borderRadius="0"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							{">"}
						</Button>

						<Button
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							{">>"}
						</Button>
					</ButtonGroup>
				</HStack>
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
			{...props}
			value={value}
			maxW={200}
			type="search"
			variant="outline"
			onChange={(e) => setValue(e.target.value)}
			_light={{
				bg: "white",
			}}
			_dark={{
				bg: "gray.800",
				color: "white",
			}}
		/>
	);
};

export const selectable = {
	id: "select",
	exportAble: false,
	header: ({ table }) => (
		<IndeterminateCheckbox
			{...{
				isChecked: table.getIsAllRowsSelected(),
				isIndeterminate: table.getIsSomeRowsSelected(),
				onChange: table.getToggleAllRowsSelectedHandler(),
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

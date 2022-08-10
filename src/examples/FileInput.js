import { Box, Button, Container, Heading, Link } from "@chakra-ui/react";
import { Formik } from "formik";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import * as Yup from "yup";
import { MyFileInput } from "../components/CustomInput";

const FileInput = () => {
	const [errorMessage, setErrorMessage] = useState("");
	const fileSchemaSingle = Yup.object().shape({
		file: Yup.mixed()
			.required("File is required")
			.test("fileSize", "The file is too large", (value) => {
				let size = 500 * 1024;
				return value && value.size < size;
			}),
	});
	const fileSchemaMultiple = Yup.object().shape({
		file: Yup.mixed()
			.required("File is required")
			.test("fileSize", errorMessage, function (value) {
				if (value && value?.length > 0) {
					for (let i = 0; i < value.length; i++) {
						if (value[i].size > 500 * 1024) {
							setErrorMessage("The file " + value[i].name + " is too large");
							return false;
						}
					}
				}
				return true;
			}),
	});
	return (
		<Container maxW="2xl" bg="blue.200" minH={"100vh"} p={2}>
			<Link as={RouterLink} to="/">
				Back
			</Link>
			<Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					File Input Single With Validation
				</Heading>
				<Formik
					initialValues={{
						file: null,
					}}
					onSubmit={(values) => {
						console.log(values);
					}}
					validationSchema={fileSchemaSingle}
				>
					{(props) => (
						<form onSubmit={props.handleSubmit}>
							<MyFileInput
								name="file"
								label={"Drop file here or click to upload"}
								accept=".jpg,.png,.jpeg,.gif"
								rules={{
									required: true,
								}}
							/>
							<Button mt={5} type="submit">
								Submit
							</Button>
						</form>
					)}
				</Formik>
			</Box>
			<Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					File Input Single With Preview
				</Heading>
				<Formik
					initialValues={{
						file: null,
					}}
					onSubmit={(values) => {
						console.log(values);
					}}
					validationSchema={fileSchemaSingle}
				>
					{(props) => (
						<form onSubmit={props.handleSubmit}>
							<MyFileInput
								name="file"
								label={"Drop file here or click to upload"}
								accept=".jpg,.png,.jpeg,.gif"
								rules={{
									required: true,
									preview: true,
								}}
							/>
							<Button mt={5} type="submit">
								Submit
							</Button>
						</form>
					)}
				</Formik>
			</Box>
			<Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					File Input Multiple With Preview
				</Heading>
				<Formik
					initialValues={{
						file: null,
					}}
					onSubmit={(values) => {
						console.log(values);
					}}
				>
					{(props) => (
						<form onSubmit={props.handleSubmit}>
							<MyFileInput
								name="file"
								label={"Drop file here or click to upload"}
								accept=".jpg,.png,.jpeg,.gif"
								rules={{
									required: true,
									preview: true,
									multiple: true,
								}}
							/>
							<Button mt={5} type="submit">
								Submit
							</Button>
						</form>
					)}
				</Formik>
			</Box>
			<Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					File Input Multiple With Validation
				</Heading>
				<Formik
					initialValues={{
						file: null,
					}}
					onSubmit={(values) => {
						console.log(values);
					}}
					validationSchema={fileSchemaMultiple}
				>
					{(props) => (
						<form onSubmit={props.handleSubmit}>
							<MyFileInput
								name="file"
								label={"Drop files here or click to upload"}
								accept=".jpg,.png,.jpeg,.gif"
								rules={{
									required: true,
									preview: true,
									multiple: true,
								}}
							/>
							<Button mt={5} type="submit">
								Submit
							</Button>
						</form>
					)}
				</Formik>
			</Box>
		</Container>
	);
};
export default FileInput;

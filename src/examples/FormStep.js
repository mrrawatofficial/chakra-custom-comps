import { Box, Container, Heading, HStack, Link } from "@chakra-ui/react";
import * as Yup from "yup";
import { Link as RouterLink } from "react-router-dom";
import { Wizard, WizardStep } from "../components/Wizard";
import { MyInput } from "../components/CustomInput";
const FormStep = () => {
	const schemas = [
		Yup.object().shape({
			project_name: Yup.string().required("Project name is required"),
			project_description: Yup.string().required(
				"Project description is required"
			),
			state: Yup.string().required("State is required"),
		}),
		Yup.object().shape({
			team_name: Yup.string().required("Team name is required"),
			team_description: Yup.string().required("Team description is required"),
		}),
		// Yup.object().shape({
		// 	payment_amount: Yup.string().required("Payment amount is required"),
		// 	payment_description: Yup.string().required(
		// 		"Payment description is required"
		// 	),
		// }),
	];
	return (
		<Container maxW="2xl" bg="blue.200" minH={"100vh"} p={2}>
			<Link as={RouterLink} to="/">
				Back
			</Link>
			{/* <Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					Vertical Wizard
				</Heading>
				<Wizard
					submit={(values) => {
						console.log(values);
					}}
					initialValues={{
						project_name: "",
						project_description: "",
						team_name: "",
						team_description: "",
						payment_amount: "",
						payment_description: "",
					}}
					validationSchema={schemas}
					vertical={true}
				>
					<WizardStep
						title="Project details"
						icon={
							<img
								src="https://img.icons8.com/color/48/000000/project.png"
								alt="Project Details"
							/>
						}
					>
						<HStack>
							<MyInput
								label="Project name"
								name="project_name"
								rules={{
									required: true,
								}}
							/>
							<MyInput
								label="Project description"
								name="project_description"
								rules={{
									required: true,
								}}
							/>
						</HStack>
					</WizardStep>
					<WizardStep
						title="Team details"
						icon={
							<img
								src="https://img.icons8.com/color/48/000000/team.png"
								alt="Team Details"
							/>
						}
					>
						<HStack>
							<MyInput
								label="Team name"
								name="team_name"
								rules={{
									required: true,
								}}
							/>
							<MyInput
								label="Team description"
								name="team_description"
								rules={{
									required: true,
								}}
							/>
						</HStack>
					</WizardStep>
					<WizardStep
						title="Payment details"
						icon={
							<img
								src="https://img.icons8.com/color/48/000000/money.png"
								alt="Payment Details"
							/>
						}
					>
						<VStack spacing={3}>
							<MyInput
								label="Payment amount"
								name="payment_amount"
								rules={{
									required: true,
								}}
							/>
							<MyInput
								label="Payment description"
								name="payment_description"
								rules={{
									required: true,
								}}
							/>
						</VStack>
					</WizardStep>
				</Wizard>
			</Box>
			<Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					Horizontal Wizard
				</Heading>
				<Wizard
					submit={(values) => {
						console.log(values);
					}}
					initialValues={{
						project_name: "",
						project_description: "",
						team_name: "",
						team_description: "",
						payment_amount: "",
						payment_description: "",
					}}
					validationSchema={schemas}
				>
					<WizardStep
						title="Project details"
						icon={
							<img
								src="https://img.icons8.com/color/48/000000/project.png"
								alt="Project Details"
							/>
						}
					>
						<HStack>
							<MyInput
								label="Project name"
								name="project_name"
								rules={{
									required: true,
								}}
							/>
							<MyInput
								label="Project description"
								name="project_description"
								rules={{
									required: true,
								}}
							/>
						</HStack>
					</WizardStep>
					<WizardStep
						title="Team details"
						icon={
							<img
								src="https://img.icons8.com/color/48/000000/team.png"
								alt="Team Details"
							/>
						}
					>
						<HStack>
							<MyInput
								label="Team name"
								name="team_name"
								rules={{
									required: true,
								}}
							/>
							<MyInput
								label="Team description"
								name="team_description"
								rules={{
									required: true,
								}}
							/>
						</HStack>
					</WizardStep>
					<WizardStep
						title="Payment details"
						icon={
							<img
								src="https://img.icons8.com/color/48/000000/money.png"
								alt="Payment Details"
							/>
						}
					>
						<VStack spacing={3}>
							<MyInput
								label="Payment amount"
								name="payment_amount"
								rules={{
									required: true,
								}}
							/>
							<MyInput
								label="Payment description"
								name="payment_description"
								rules={{
									required: true,
								}}
							/>
						</VStack>
					</WizardStep>
				</Wizard>
			</Box>
			<Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					No Validation Wizard
				</Heading>
				<Wizard
					submit={(values) => {
						console.log(values);
					}}
					initialValues={{
						project_name: "",
						project_description: "",
						team_name: "",
						team_description: "",
						payment_amount: "",
						payment_description: "",
					}}
				>
					<WizardStep
						title="Project details"
						icon={
							<img
								src="https://img.icons8.com/color/48/000000/project.png"
								alt="Project Details"
							/>
						}
					>
						<HStack>
							<MyInput label="Project name" name="project_name" />
							<MyInput label="Project description" name="project_description" />
						</HStack>
					</WizardStep>
					<WizardStep
						title="Team details"
						icon={
							<img
								src="https://img.icons8.com/color/48/000000/team.png"
								alt="Team Details"
							/>
						}
					>
						<HStack>
							<MyInput label="Team name" name="team_name" />
							<MyInput label="Team description" name="team_description" />
						</HStack>
					</WizardStep>
					<WizardStep
						title="Payment details"
						icon={
							<img
								src="https://img.icons8.com/color/48/000000/money.png"
								alt="Payment Details"
							/>
						}
					>
						<VStack spacing={3}>
							<MyInput label="Payment amount" name="payment_amount" />
							<MyInput label="Payment description" name="payment_description" />
						</VStack>
					</WizardStep>
				</Wizard>
			</Box>
			<Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					No Icon Vertical Wizard
				</Heading>
				<Wizard
					submit={(values) => {
						console.log(values);
					}}
					initialValues={{
						project_name: "",
						project_description: "",
						team_name: "",
						team_description: "",
						payment_amount: "",
						payment_description: "",
					}}
					vertical={true}
				>
					<WizardStep title="Project details">
						<HStack>
							<MyInput label="Project name" name="project_name" />
							<MyInput label="Project description" name="project_description" />
						</HStack>
					</WizardStep>
					<WizardStep title="Team details">
						<HStack>
							<MyInput label="Team name" name="team_name" />
							<MyInput label="Team description" name="team_description" />
						</HStack>
					</WizardStep>
					<WizardStep title="Payment details">
						<VStack spacing={3}>
							<MyInput label="Payment amount" name="payment_amount" />
							<MyInput label="Payment description" name="payment_description" />
						</VStack>
					</WizardStep>
				</Wizard>
			</Box> */}
			<Box padding="4" bg="blue.400" color="black" w="full">
				<Heading as="h2" size="xl" color="black" textAlign={"center"} mb={3}>
					No Stepper Wizard
				</Heading>
				<Wizard
					submit={(values) => {
						console.log(values);
					}}
					initialValues={{
						project_name: "",
						project_description: "",
						state: "",
						team_name: "",
						team_description: "",
						// payment_amount: "",
						// payment_description: "",
					}}
					validationSchema={schemas}
					stepper={false}
				>
					<WizardStep title="Project details">
						<HStack>
							<MyInput label="Project name" name="project_name" />
							<MyInput label="Project description" name="project_description" />
						</HStack>
						<HStack>
							<MyInput select label="Select State" name="state">
								<option value="option1">Option 1</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
							</MyInput>
							{/* <Select></Select> */}
							{/* <Select placeholder="Select option">
								<option value="option1">Option 1</option>
								<option value="option2">Option 2</option>
								<option value="option3">Option 3</option>
							</Select> */}
						</HStack>
					</WizardStep>
					<WizardStep title="Team details">
						<HStack>
							<MyInput label="Team name" name="team_name" />
							<MyInput label="Team description" name="team_description" />
						</HStack>
					</WizardStep>
					{/* <WizardStep title="Payment details">
						<VStack spacing={3}>
							<MyInput label="Payment amount" name="payment_amount" />
							<MyInput label="Payment description" name="payment_description" />
						</VStack>
					</WizardStep> */}
				</Wizard>
			</Box>
		</Container>
	);
};
export default FormStep;

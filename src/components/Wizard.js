import { Box, Button, Center, HStack, Stack } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useState } from "react";
import { HiCheck } from "react-icons/hi";

export const Wizard = ({
	children,
	submit,
	initialValues,
	validationSchema,
	stepper = true,
	vertical = false,
}) => {
	const [currentStep, setCurrentStep] = useState(0);

	return (
		<Box className="wizard">
			{stepper && (
				<Stack
					className="wizard-header"
					flexWrap={"wrap"}
					gap={2}
					direction={vertical ? "column" : "row"}
				>
					{children.map((child, index) => (
						<Stack
							key={index}
							direction={vertical ? "column" : "row"}
							flexWrap={"wrap"}
							gap={2}
							flexGrow={1}
						>
							<WizardStep
								title={child.props.title}
								icon={child.props.icon}
								active={index === currentStep}
								complete={index < currentStep}
								number={index + 1}
							>
								{child}
							</WizardStep>
							{vertical && index === currentStep && (
								<WizardBody
									submit={submit}
									initialValues={initialValues}
									validationSchema={validationSchema}
									currentStep={currentStep}
									setCurrentStep={setCurrentStep}
									body={children[currentStep].props.children}
									length={children.length}
								/>
							)}
						</Stack>
					))}
				</Stack>
			)}
			{!vertical && (
				<WizardBody
					submit={submit}
					initialValues={initialValues}
					validationSchema={validationSchema}
					currentStep={currentStep}
					setCurrentStep={setCurrentStep}
					body={children[currentStep].props.children}
					length={children.length}
				/>
			)}
		</Box>
	);
};

export const WizardStep = ({ icon, title, active, complete, number }) => {
	return (
		<Box
			_dark={{
				bg: active ? "primary.200" : complete ? "green.300" : "gray.700",
				color: complete ? "gray.900" : "gray.300",
			}}
			_light={{
				bg: active ? "primary.200" : complete ? "green.300" : "gray.300",
			}}
			flexGrow={1}
			p={1}
			borderRadius={"md"}
			marginInlineStart={"0!important"}
		>
			<HStack>
				<Center
					width={10}
					height={10}
					bg={active ? "primary.400" : complete ? "green.300" : "gray.300"}
					borderRadius={"full"}
					borderColor="white"
					borderWidth={2}
					borderStyle="solid"
					padding={1}
					overflow="hidden"
				>
					{complete ? <HiCheck /> : icon ? icon : number}
				</Center>
				<Box>{title}</Box>
			</HStack>
		</Box>
	);
};

export const WizardBody = ({
	submit,
	initialValues,
	validationSchema,
	currentStep,
	setCurrentStep,
	length,
	body,
}) => {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handlePrevious = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const submitForm = async (values, actions) => {
		if (currentStep === length - 1) {
			setIsSubmitting(true);
			submit(values, actions);
			setTimeout(() => {
				setIsSubmitting(false);
				actions.resetForm();
				setCurrentStep(0);
			}, 2000);
		} else {
			setCurrentStep(currentStep + 1);
			actions.setTouched({});
			setIsSubmitting(false);
		}
	};
	return (
		<Box
			className="wizard-body"
			p={2}
			my={2}
			borderRadius="md"
			_dark={{
				bg: "gray.700",
			}}
			_light={{
				bg: "white",
			}}
		>
			<Formik
				initialValues={initialValues}
				onSubmit={submitForm}
				validationSchema={validationSchema && validationSchema[currentStep]}
			>
				{() => (
					<Form>
						{body}
						<Box className="wizard-footer">
							<HStack mt={5} justifyContent="flex-end">
								{currentStep > 0 && (
									<Button colorScheme="red" onClick={handlePrevious}>
										Previous
									</Button>
								)}
								<Button
									colorScheme={currentStep === length - 1 ? "green" : "primary"}
									type="submit"
									isDisabled={isSubmitting}
									isLoading={isSubmitting}
								>
									{currentStep === length - 1 ? "Submit" : "Next"}
								</Button>
							</HStack>
						</Box>
					</Form>
				)}
			</Formik>
		</Box>
	);
};

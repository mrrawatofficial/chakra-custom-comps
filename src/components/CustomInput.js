import {
	FormControl,
	FormErrorMessage,
	FormLabel,
} from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { useField } from "formik";

export const MyInput = ({ label, rules, ...props }) => {
	const [field, meta] = useField(props);

	return (
		<FormControl isInvalid={Boolean(meta.touched && meta.error)}>
			<FormLabel
				_dark={{
					color: "gray.300",
				}}
				_light={{
					color: "gray.700",
				}}
			>
				{label}{" "}
				{rules && rules.required && <span style={{ color: "red" }}>*</span>}
			</FormLabel>
			<Input
				{...field}
				variant="outline"
				_dark={{
					color: "gray.300",
				}}
				_light={{
					color: "gray.700",
				}}
				borderWidth={1}
				{...props}
			/>
			{meta.touched && meta.error ? (
				<FormErrorMessage>{meta.error}</FormErrorMessage>
			) : null}
		</FormControl>
	);
};

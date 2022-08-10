// import FormStep from "../examples/FormStep";
import { Link as RouterLink } from "react-router-dom";

import {
	Box,
	Center,
	Container,
	Link,
	ListItem,
	OrderedList,
} from "@chakra-ui/react";

const Home = () => {
	return (
		<Container as={Center} maxW="7xl" minH={"100vh"}>
			<Box bg="blue.200" p={5} borderRadius={"lg"} minW={"md"}>
				<OrderedList>
					<ListItem>
						<Link as={RouterLink} to="/wizard">
							FormStep
						</Link>
					</ListItem>
					<ListItem>
						<Link as={RouterLink} to="/file-input">
							File Input
						</Link>
					</ListItem>
				</OrderedList>
			</Box>
		</Container>
	);
};
export default Home;

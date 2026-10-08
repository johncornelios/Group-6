import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, type Href } from 'expo-router';

const cameraRoute = '/camera' as Href;

export default function LocationScreen() {
	return (
		<View style={styles.container}>
			<Pressable style={styles.button} onPress={() => router.push(cameraRoute)}>
				<Text style={styles.buttonText}>Open camera</Text>
			</Pressable>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		padding: 24,
	},
	button: {
		borderRadius: 8,
		backgroundColor: '#d32f2f',
		paddingHorizontal: 20,
		paddingVertical: 12,
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: '600',
	},
});

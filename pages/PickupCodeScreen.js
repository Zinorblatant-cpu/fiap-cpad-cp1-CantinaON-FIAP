import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import ScreenHeader from '../components/ScreenHeader';
import { useAppContext } from '../context/AppContext';

export default function PickupCodeScreen({ navigation }) {
  const { currentUser, lastPickupCode } = useAppContext();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScreenHeader
        title="CODIGO DE RETIRADA"
        subtitle="Use esse numero para acompanhar o atendimento"
      />

      <View style={styles.content}>
        <View style={styles.codeCard}>
          <Text style={styles.codeLabel}>Codigo gerado</Text>
          <Text style={styles.codeValue}>{lastPickupCode ?? '--'}</Text>
          <Text style={styles.codeInfo}>Aguarde a chamada do seu codigo no balcao.</Text>
          {currentUser ? (
            <Text style={styles.userInfo}>Pedido vinculado a {currentUser.fullName}</Text>
          ) : null}
        </View>
      </View>

      <View style={styles.footer}>
        <ActionButton label="NOVO PEDIDO" onPress={() => navigation.navigate('Menu')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  codeCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    alignItems: 'center',
  },
  codeLabel: {
    color: '#B8B8B8',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
  },
  codeValue: {
    fontSize: 88,
    fontWeight: 'bold',
    color: '#E3000B',
    marginBottom: 16,
  },
  codeInfo: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 12,
  },
  userInfo: {
    color: '#B8B8B8',
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    backgroundColor: '#000000',
    borderTopWidth: 1,
    borderTopColor: '#2B2B2B',
  },
});

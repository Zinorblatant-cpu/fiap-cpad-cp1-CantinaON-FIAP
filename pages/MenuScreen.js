import { StatusBar } from 'expo-status-bar';
import { ScrollView, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ActionButton from '../components/ActionButton';
import ScreenHeader from '../components/ScreenHeader';
import { useAppContext } from '../context/AppContext';
import { MENU_ITEMS } from '../data/menuItems';

export default function MenuScreen({ navigation }) {
  const { addItemToCart, cartItems, currentUser, logoutUser } = useAppContext();

  const goToCart = () => {
    navigation.navigate('Cart');
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScreenHeader
        title="FIAP BURGER"
        subtitle="Monte seu pedido e retire sem fila"
      >
        <TouchableOpacity style={styles.cartButton} onPress={goToCart}>
          <Text style={styles.cartIcon}>🛒</Text>
          {cartItems.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartItems.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </ScreenHeader>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.heroCard}>
          <View>
            <Text style={styles.heroLabel}>Bem-vindo</Text>
            <Text style={styles.heroName}>{currentUser?.fullName ?? 'Visitante'}</Text>
            <Text style={styles.heroEmail}>{currentUser?.email ?? 'Sem sessao ativa'}</Text>
          </View>

          <View style={styles.heroActions}>
            <TouchableOpacity onPress={handleLogout}>
              <Text style={styles.logoutText}>SAIR</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Cardapio do dia</Text>

        <View style={styles.grid}>
          {MENU_ITEMS.map((item) => (
            <View key={item.id} style={styles.menuCard}>
              <Image source={item.image} style={styles.image} />
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemPrice}>{item.price}</Text>
              <ActionButton
                label={`Adicionar ${item.name}`}
                onPress={() => addItemToCart(item)}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000000',
    flex: 1,
  },
  cartButton: {
    padding: 8,
    position: 'relative',
  },
  cartIcon: {
    fontSize: 28,
    color: '#FFFFFF',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#E3000B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  heroCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 18,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2B2B2B',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  heroLabel: {
    color: '#B8B8B8',
    fontSize: 12,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  heroEmail: {
    color: '#B8B8B8',
    fontSize: 13,
  },
  heroActions: {
    paddingTop: 4,
  },
  logoutText: {
    color: '#FF9090',
    fontWeight: 'bold',
    fontSize: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  grid: {
    gap: 14,
  },
  menuCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
    textTransform: 'capitalize',
  },
  itemDescription: {
    color: '#B8B8B8',
    lineHeight: 20,
    marginBottom: 10,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E3000B',
    marginBottom: 12,
  },
});
